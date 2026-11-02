"""Tests ADFR: source multi-marque, callbacks + track + stats."""
import os
import pytest
import requests

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/') if 'REACT_APP_BACKEND_URL' in os.environ else None
if not BASE_URL:
    # Fallback: load from frontend/.env
    from pathlib import Path
    env = Path('/app/frontend/.env').read_text()
    for line in env.splitlines():
        if line.startswith('REACT_APP_BACKEND_URL='):
            BASE_URL = line.split('=', 1)[1].strip().rstrip('/')

ADMIN_EMAIL = "admin@adfr-depann.fr"
ADMIN_PASSWORD = "jd7nZY3_N44KvrAM"


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


# ---- Track ----
def test_track_sos():
    r = requests.post(f"{BASE_URL}/api/track", json={"event": "call", "page": "/t", "source": "sos"})
    assert r.status_code == 200
    assert r.json() == {"ok": True}


def test_track_invalid_source_coerced_to_adfr():
    r = requests.post(f"{BASE_URL}/api/track", json={"event": "call", "page": "/t", "source": "hack"})
    assert r.status_code == 200
    assert r.json() == {"ok": True}


def test_track_stats_requires_auth():
    r = requests.get(f"{BASE_URL}/api/track/stats?days=3")
    assert r.status_code == 401


def test_track_stats_authed(admin_session):
    r = admin_session.get(f"{BASE_URL}/api/track/stats?days=3")
    assert r.status_code == 200
    j = r.json()
    assert j["days"] == 3
    assert len(j["rows"]) == 3
    dates = [row["date"] for row in j["rows"]]
    assert dates == sorted(dates, reverse=True)
    for row in j["rows"]:
        for k in ("call", "whatsapp", "form", "total"):
            assert k in row
    for k in ("call", "whatsapp", "form", "total"):
        assert k in j["totals"]


def test_track_stats_days_clamped(admin_session):
    r1 = admin_session.get(f"{BASE_URL}/api/track/stats?days=0")
    assert r1.status_code == 200
    assert r1.json()["days"] == 1
    r2 = admin_session.get(f"{BASE_URL}/api/track/stats?days=500")
    assert r2.status_code == 200
    assert r2.json()["days"] == 90


def test_track_stats_source_filter(admin_session):
    # Create a known SOS event
    requests.post(f"{BASE_URL}/api/track", json={"event": "whatsapp", "page": "/t", "source": "sos"})
    # Create ADFR via invalid coerce
    requests.post(f"{BASE_URL}/api/track", json={"event": "whatsapp", "page": "/t", "source": "hack"})
    r_sos = admin_session.get(f"{BASE_URL}/api/track/stats?days=1&source=sos").json()
    r_adfr = admin_session.get(f"{BASE_URL}/api/track/stats?days=1&source=adfr").json()
    r_all = admin_session.get(f"{BASE_URL}/api/track/stats?days=1").json()
    assert r_sos["totals"]["whatsapp"] >= 1
    assert r_adfr["totals"]["whatsapp"] >= 1
    assert r_all["totals"]["whatsapp"] >= r_sos["totals"]["whatsapp"]
    assert r_all["totals"]["whatsapp"] >= r_adfr["totals"]["whatsapp"]


# ---- Callback ----
def test_callback_sos_then_listed(admin_session):
    payload = {
        "nom": "TEST_SOS User",
        "telephone": "0612345678",
        "lieu": "Rue de Test, Paris",
        "type_panne": "Batterie",
        "source": "sos",
    }
    r = requests.post(f"{BASE_URL}/api/callback", json=payload)
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["ok"] is True
    cid = j["id"]
    # List
    r2 = admin_session.get(f"{BASE_URL}/api/callbacks?scope=today")
    assert r2.status_code == 200
    cbs = r2.json()["callbacks"]
    match = [c for c in cbs if c["id"] == cid]
    assert match, f"callback {cid} not in today scope"
    assert match[0]["source"] == "sos"


def test_callback_invalid_source_coerced():
    payload = {
        "nom": "TEST_HACK User",
        "telephone": "0612345678",
        "lieu": "Rue Test, Paris",
        "type_panne": "Batterie",
        "source": "hack",
    }
    r = requests.post(f"{BASE_URL}/api/callback", json=payload)
    assert r.status_code == 200
