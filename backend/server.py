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
    doc = {**data, "created_at": now_iso()}
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
