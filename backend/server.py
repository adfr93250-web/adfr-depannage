from fastapi import FastAPI, APIRouter, HTTPException
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


class CallbackCreate(BaseModel):
    nom: str
    telephone: str
    lieu: str
    type_panne: str
    zone: str | None = None

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
async def create_callback(input: CallbackCreate):
    try:
        data = input.model_dump()
    except Exception:
        raise HTTPException(status_code=400, detail="Données invalides")
    doc = {**data, "handled": False, "handled_at": None, "created_at": now_iso()}
    result = await db.callbacks.insert_one(doc)
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
