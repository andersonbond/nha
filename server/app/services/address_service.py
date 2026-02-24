"""
Address data service: Redis-first, then load from DB (if session and tables populated) or CSV.
Returns lists of { "code": str, "name": str }.
"""

import csv
from pathlib import Path
from typing import TYPE_CHECKING

from app.redis_client import address_cache_get, address_cache_set

if TYPE_CHECKING:
    from sqlalchemy.orm import Session

# CSVs live in server/address_data/ relative to server app
_ADDRESS_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "address_data"

_CACHE_KEY_REGIONS = "address:regions"
_CACHE_KEY_PROVINCES = "address:provinces:{region_code}"
_CACHE_KEY_MUNICIPALITIES = "address:municipalities:{province_code}"
_CACHE_KEY_BARANGAYS = "address:barangays:{municipal_code}"
_CACHE_TTL = 86400 * 7  # 7 days


def _load_regions_csv() -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    path = _ADDRESS_DATA_DIR / "adm1_regions.csv"
    if not path.exists():
        return out
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            pcode = (row.get("adm1_pcode") or "").strip()
            name = (row.get("adm1_en") or "").strip()
            if pcode:
                out.append({"code": pcode, "name": name})
    return out


def _load_provinces_csv(region_code: str) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    path = _ADDRESS_DATA_DIR / "adm2_provinces.csv"
    if not path.exists() or not region_code:
        return out
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if (row.get("adm1_pcode") or "").strip() != region_code:
                continue
            pcode = (row.get("adm2_pcode") or "").strip()
            name = (row.get("adm2_en") or "").strip()
            if pcode:
                out.append({"code": pcode, "name": name})
    return out


def _load_municipalities_csv(province_code: str) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    path = _ADDRESS_DATA_DIR / "adm3_municipalities.csv"
    if not path.exists() or not province_code:
        return out
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if (row.get("adm2_pcode") or "").strip() != province_code:
                continue
            pcode = (row.get("adm3_pcode") or "").strip()
            name = (row.get("adm3_en") or "").strip()
            if pcode:
                out.append({"code": pcode, "name": name})
    return out


def _load_barangays_csv(municipal_code: str) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    path = _ADDRESS_DATA_DIR / "adm4_barangays.csv"
    if not path.exists() or not municipal_code:
        return out
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if (row.get("adm3_pcode") or "").strip() != municipal_code:
                continue
            pcode = (row.get("adm4_pcode") or "").strip()
            name = (row.get("adm4_en") or "").strip()
            if pcode:
                out.append({"code": pcode, "name": name})
    return out


def _load_regions_db(db: "Session") -> list[dict[str, str]] | None:
    try:
        from app.models import AddressRegion
        rows = db.query(AddressRegion).order_by(AddressRegion.adm1_pcode).all()
        if not rows:
            return None
        return [{"code": r.adm1_pcode, "name": r.adm1_en} for r in rows]
    except Exception:
        return None


def _load_provinces_db(db: "Session", region_code: str) -> list[dict[str, str]] | None:
    try:
        from app.models import AddressProvince
        rows = db.query(AddressProvince).filter(AddressProvince.adm1_pcode == region_code).order_by(AddressProvince.adm2_pcode).all()
        return [{"code": r.adm2_pcode, "name": r.adm2_en} for r in rows]
    except Exception:
        return None


def _load_municipalities_db(db: "Session", province_code: str) -> list[dict[str, str]] | None:
    try:
        from app.models import AddressMunicipality
        rows = db.query(AddressMunicipality).filter(AddressMunicipality.adm2_pcode == province_code).order_by(AddressMunicipality.adm3_pcode).all()
        return [{"code": r.adm3_pcode, "name": r.adm3_en} for r in rows]
    except Exception:
        return None


def _load_barangays_db(db: "Session", municipal_code: str) -> list[dict[str, str]] | None:
    try:
        from app.models import AddressBarangay
        rows = db.query(AddressBarangay).filter(AddressBarangay.adm3_pcode == municipal_code).order_by(AddressBarangay.adm4_pcode).all()
        return [{"code": r.adm4_pcode, "name": r.adm4_en} for r in rows]
    except Exception:
        return None


def get_regions(db: "Session | None" = None) -> list[dict[str, str]]:
    """Regions: try Redis, then DB (if session) or CSV, then cache."""
    cached = address_cache_get(_CACHE_KEY_REGIONS)
    if cached is not None:
        return cached
    if db is not None:
        data = _load_regions_db(db)
        if data is not None:
            address_cache_set(_CACHE_KEY_REGIONS, data, _CACHE_TTL)
            return data
    data = _load_regions_csv()
    address_cache_set(_CACHE_KEY_REGIONS, data, _CACHE_TTL)
    return data


def get_provinces(region_code: str, db: "Session | None" = None) -> list[dict[str, str]]:
    """Provinces for region: try Redis, then DB or CSV, then cache."""
    key = _CACHE_KEY_PROVINCES.format(region_code=region_code)
    cached = address_cache_get(key)
    if cached is not None:
        return cached
    if db is not None:
        data = _load_provinces_db(db, region_code)
        if data is not None:
            address_cache_set(key, data, _CACHE_TTL)
            return data
    data = _load_provinces_csv(region_code)
    address_cache_set(key, data, _CACHE_TTL)
    return data


def get_municipalities(province_code: str, db: "Session | None" = None) -> list[dict[str, str]]:
    """Municipalities for province: try Redis, then DB or CSV, then cache."""
    key = _CACHE_KEY_MUNICIPALITIES.format(province_code=province_code)
    cached = address_cache_get(key)
    if cached is not None:
        return cached
    if db is not None:
        data = _load_municipalities_db(db, province_code)
        if data is not None:
            address_cache_set(key, data, _CACHE_TTL)
            return data
    data = _load_municipalities_csv(province_code)
    address_cache_set(key, data, _CACHE_TTL)
    return data


def get_barangays(municipal_code: str, db: "Session | None" = None) -> list[dict[str, str]]:
    """Barangays for municipality: try Redis, then DB or CSV, then cache."""
    key = _CACHE_KEY_BARANGAYS.format(municipal_code=municipal_code)
    cached = address_cache_get(key)
    if cached is not None:
        return cached
    if db is not None:
        data = _load_barangays_db(db, municipal_code)
        if data is not None:
            address_cache_set(key, data, _CACHE_TTL)
            return data
    data = _load_barangays_csv(municipal_code)
    address_cache_set(key, data, _CACHE_TTL)
    return data


def warm_address_cache(db: "Session | None" = None) -> None:
    """Preload all address data into Redis from DB or CSV."""
    regions = get_regions(db)
    for r in regions:
        provs = get_provinces(r["code"], db)
        for p in provs:
            muns = get_municipalities(p["code"], db)
            for m in muns:
                get_barangays(m["code"], db)
