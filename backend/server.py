from fastapi import FastAPI, APIRouter, BackgroundTasks, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, field_validator
import os
import re
import logging
from pathlib import Path
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

PANNE_TYPES = {
    "Remorquage", "Batterie", "Crevaison", "Panne de carburant",
    "Véhicule accidenté", "Sortie de fourrière", "Autre panne",
}


BRAND_NAMES = {"adfr": "ADFR", "sos": "SOS Dépannage"}
BRAND_IDS = set(BRAND_NAMES)


class CallbackCreate(BaseModel):
    nom: str
    telephone: str
    lieu: str
    type_panne: str
    zone: str | None = None
    source: str = "adfr"

    @field_validator("source")
    @classmethod
    def check_source(cls, v: str) -> str:
        return v if v in BRAND_IDS else "adfr"

    @field_validator("nom")
    @classmethod
    def check_nom(cls, v: str) -> str:
        v = v.strip()
        if not (2 <= len(v) <= 80):
            raise ValueError("Nom invalide")
        return v

    @field_validator("lieu")
    @classmethod
    def check_lieu(cls, v: str) -> str:
        v = v.strip()
        if not (2 <= len(v) <= 160):
            raise ValueError("Lieu invalide")
        return v

    @field_validator("telephone")
    @classmethod
    def check_phone(cls, v: str) -> str:
        digits = re.sub(r"\D", "", v)
        if not (9 <= len(digits) <= 15):
            raise ValueError("Numéro de téléphone invalide")
        return v.strip()

    @field_validator("type_panne")
    @classmethod
    def check_type(cls, v: str) -> str:
        if v not in PANNE_TYPES:
            raise ValueError("Type de panne invalide")
        return v


class TrackCreate(BaseModel):
    event: str
    page: str
    source: str = "adfr"

    @field_validator("source")
    @classmethod
    def check_source(cls, v: str) -> str:
        return v if v in BRAND_IDS else "adfr"

    @field_validator("event")
    @classmethod
    def check_event(cls, v: str) -> str:
        if v not in {"call", "whatsapp", "form"}:
            raise ValueError("Événement inconnu")
        return v

    @field_validator("page")
    @classmethod
    def check_page(cls, v: str) -> str:
        v = v.strip()[:200]
        if not v:
            raise ValueError("Page invalide")
        return v


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.post("/callback")
async def create_callback(input: CallbackCreate, background_tasks: BackgroundTasks):
    try:
        data = input.model_dump()
    except Exception:
        raise HTTPException(status_code=400, detail="Données invalides")
    doc = {**data, "handled": False, "handled_at": None, "created_at": now_iso()}
    result = await db.callbacks.insert_one(doc)
    background_tasks.add_task(send_new_callback_email, doc)
    return {"ok": True, "id": str(result.inserted_id)}


@api_router.post("/track")
async def create_track_event(input: TrackCreate):
    try:
        data = input.model_dump()
    except Exception:
        raise HTTPException(status_code=400, detail="Données invalides")
    doc = {**data, "created_at": now_iso()}
    await db.track_events.insert_one(doc)
    return {"ok": True}


import bcrypt
import jwt
from bson import ObjectId
from zoneinfo import ZoneInfo
from fastapi import Depends, Request, Response
from datetime import timedelta

JWT_ALGORITHM = "HS256"
PARIS_TZ = ZoneInfo("Europe/Paris")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(email: str) -> str:
    payload = {"sub": email, "type": "access", "exp": datetime.now(timezone.utc) + timedelta(minutes=15)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def create_refresh_token(email: str) -> str:
    payload = {"sub": email, "type": "refresh", "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, email: str) -> None:
    response.set_cookie(key="access_token", value=create_access_token(email), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=create_refresh_token(email), httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_admin(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Type de token invalide")
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@adfr-depann.fr")
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    if not admin_password:
        return
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "ADFR",
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info("Admin seedé: %s", admin_email)


def client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


class LoginCreate(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def check_email(cls, v: str) -> str:
        v = v.strip().lower()
        if "@" not in v:
            raise ValueError("Email invalide")
        return v

    @field_validator("password")
    @classmethod
    def check_password(cls, v: str) -> str:
        if not v:
            raise ValueError("Mot de passe requis")
        return v


class CallbackUpdate(BaseModel):
    handled: bool


@api_router.post("/auth/login")
async def login(request: Request, response: Response, body: LoginCreate):
    identifier = f"{client_ip(request)}:{body.email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until"):
        if datetime.now(timezone.utc) < datetime.fromisoformat(attempt["locked_until"]):
            raise HTTPException(status_code=429, detail="Trop de tentatives. Réessayez dans 15 minutes.")
    admin = await db.users.find_one({"email": body.email, "role": "admin"})
    if not admin or not verify_password(body.password, admin.get("password_hash", "")):
        count = (attempt.get("count", 0) + 1) if attempt else 1
        update = {"count": count}
        if count >= 5:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
            update["count"] = 0
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, admin["email"])
    return {"ok": True, "email": admin["email"]}


@api_router.post("/auth/refresh")
async def refresh_session(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Type de token invalide")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")
    set_auth_cookies(response, payload["sub"])
    return {"ok": True}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me")
async def me(email: str = Depends(get_current_admin)):
    return {"email": email, "role": "admin"}


def callback_out(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "nom": doc.get("nom", ""),
        "telephone": doc.get("telephone", ""),
        "lieu": doc.get("lieu", ""),
        "type_panne": doc.get("type_panne", ""),
        "zone": doc.get("zone"),
        "source": doc.get("source", "adfr"),
        "handled": bool(doc.get("handled", False)),
        "handled_at": doc.get("handled_at"),
        "created_at": doc.get("created_at"),
    }


@api_router.get("/callbacks")
async def list_callbacks(scope: str = "today", _: str = Depends(get_current_admin)):
    if scope == "today":
        now_paris = datetime.now(PARIS_TZ)
        day_start = now_paris.replace(hour=0, minute=0, second=0, microsecond=0)
        day_start_iso = day_start.astimezone(timezone.utc).isoformat()
        docs = await db.callbacks.find({"created_at": {"$gte": day_start_iso}}).sort("created_at", -1).to_list(500)
    else:
        docs = await db.callbacks.find().sort("created_at", -1).to_list(500)
    return {"count": len(docs), "callbacks": [callback_out(d) for d in docs]}


@api_router.get("/track/stats")
async def track_stats(days: int = 14, source: str | None = None, _: str = Depends(get_current_admin)):
    days = max(1, min(days, 90))
    today_paris = datetime.now(PARIS_TZ).date()
    first_day = today_paris - timedelta(days=days - 1)
    start_iso = datetime.combine(first_day, datetime.min.time(), tzinfo=PARIS_TZ).astimezone(timezone.utc).isoformat()
    query: dict = {"created_at": {"$gte": start_iso}}
    if source in BRAND_IDS:
        query["source"] = source if source != "adfr" else {"$in": ["adfr", None]}
    events = await db.track_events.find(query, {"_id": 0, "event": 1, "created_at": 1}).to_list(50000)

    buckets = {(first_day + timedelta(days=i)).isoformat(): {"call": 0, "whatsapp": 0, "form": 0} for i in range(days)}
    for e in events:
        try:
            day = datetime.fromisoformat(e["created_at"]).astimezone(PARIS_TZ).date().isoformat()
        except (KeyError, ValueError):
            continue
        if day in buckets and e.get("event") in buckets[day]:
            buckets[day][e["event"]] += 1

    rows = [{"date": d, **c, "total": sum(c.values())} for d, c in sorted(buckets.items(), reverse=True)]
    totals = {k: sum(r[k] for r in rows) for k in ("call", "whatsapp", "form", "total")}
    return {"days": days, "rows": rows, "totals": totals}


@api_router.patch("/callbacks/{callback_id}")
async def update_callback(callback_id: str, body: CallbackUpdate, _: str = Depends(get_current_admin)):
    try:
        oid = ObjectId(callback_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Identifiant invalide")
    result = await db.callbacks.update_one(
        {"_id": oid},
        {"$set": {"handled": body.handled, "handled_at": now_iso() if body.handled else None}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    doc = await db.callbacks.find_one({"_id": oid})
    return {"ok": True, "callback": callback_out(doc)}


@api_router.post("/auth/_noop")
async def _noop():
    return {"ok": True}


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()


import httpx
import secrets
import ipaddress
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from fastapi import Depends, Request, Response

# --- Email (Resend via integration gérée Emergent) ---
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
ALERT_EMAIL = os.environ.get("ALERT_EMAIL", "")
SITE_PUBLIC_URL = os.environ.get("SITE_PUBLIC_URL", "").rstrip("/")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} ≠ real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        try:
            code = e.response.json().get("code", "")
        except ValueError:
            code = ""
        if code in ("insufficient_credits", "integration_disabled", "daily_limit_reached"):
            logger.warning(f"Email paused: {code} ({e.response.status_code}): {e.response.json().get('message', '')}")
            return None
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        return None
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        return None


def _callback_row(d: dict) -> str:
    tel = "".join(ch for ch in d.get("telephone", "") if ch.isdigit() or ch == "+")
    try:
        received = datetime.fromisoformat(d.get("created_at", "")).astimezone(PARIS_TZ).strftime("%H:%M")
    except ValueError:
        received = escape((d.get("created_at", "") or "")[11:16])
    return (
        "<tr>"
        f"<td style='padding:10px 12px;border-bottom:1px solid #eee;color:#111;font-family:Arial,sans-serif'>{escape(d.get('nom', ''))}</td>"
        f"<td style='padding:10px 12px;border-bottom:1px solid #eee;font-family:Arial,sans-serif'>"
        f"<a href='tel:{escape(tel)}' style='color:#E30613;font-weight:bold'>{escape(d.get('telephone', ''))}</a></td>"
        f"<td style='padding:10px 12px;border-bottom:1px solid #eee;color:#111;font-family:Arial,sans-serif'>{escape(d.get('lieu', ''))}</td>"
        f"<td style='padding:10px 12px;border-bottom:1px solid #eee;color:#111;font-family:Arial,sans-serif'>{escape(d.get('type_panne', ''))}</td>"
        f"<td style='padding:10px 12px;border-bottom:1px solid #eee;color:#666;font-family:Arial,sans-serif'>{received}</td>"
        "</tr>"
    )


def _new_callback_email_html(doc: dict) -> str:
    return (
        f"<table role='presentation' width='100%' style='background:#f5f6f8;padding:24px'><tr><td>"
        f"<table role='presentation' width='100%' style='max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px'>"
        f"<tr><td style='padding:24px;background:#E30613;border-radius:12px 12px 0 0'>"
        f"<h1 style='margin:0;color:#ffffff;font-family:Arial,sans-serif;font-size:20px'>{BRAND_NAMES.get(doc.get('source', 'adfr'), 'ADFR')} — Nouvelle demande de rappel</h1>"
        f"</td></tr>"
        f"<tr><td style='padding:24px;font-family:Arial,sans-serif'>"
        f"<p style='color:#111;margin:0 0 16px'>Un client vient de demander un rappel — appelez-le au plus vite :</p>"
        f"<table role='presentation' width='100%' style='border-collapse:collapse'>"
        f"<tr>"
        f"<th style='text-align:left;padding:8px 12px;border-bottom:2px solid #0A1E4C;color:#0A1E4C;font-family:Arial,sans-serif'>Nom</th>"
        f"<th style='text-align:left;padding:8px 12px;border-bottom:2px solid #0A1E4C;color:#0A1E4C;font-family:Arial,sans-serif'>Téléphone</th>"
        f"<th style='text-align:left;padding:8px 12px;border-bottom:2px solid #0A1E4C;color:#0A1E4C;font-family:Arial,sans-serif'>Lieu</th>"
        f"<th style='text-align:left;padding:8px 12px;border-bottom:2px solid #0A1E4C;color:#0A1E4C;font-family:Arial,sans-serif'>Panne</th>"
        f"<th style='text-align:left;padding:8px 12px;border-bottom:2px solid #0A1E4C;color:#0A1E4C;font-family:Arial,sans-serif'>Reçue</th>"
        f"</tr>{_callback_row(doc)}</table>"
        f"<p style='margin:20px 0'>"
        f"<a href='{SITE_PUBLIC_URL}/admin' style='background:#E30613;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;font-family:Arial,sans-serif'>Ouvrir le suivi</a></p>"
        f"<p style='font-size:12px;color:#888;margin:16px 0 0'>Rappel : appelez le client directement, puis marquez la demande comme traitée dans le suivi. "
        f"Sent by {escape(EMAIL_FROM_NAME)}.</p>"
        f"</td></tr></table></td></tr></table>"
    )


async def send_new_callback_email(doc: dict) -> None:
    if not ALERT_EMAIL or not SITE_PUBLIC_URL:
        return
    await send_email(
        to=ALERT_EMAIL,
        subject=f"{BRAND_NAMES.get(doc.get('source', 'adfr'), 'ADFR')} — Nouvelle demande de rappel : {doc.get('nom', '')}",
        html=_new_callback_email_html(doc),
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
