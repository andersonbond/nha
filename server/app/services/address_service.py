"""
Address data service: Redis-first, then load from DB (if session and tables populated) or CSV.
Returns lists of { "code": str, "name": str }.
"""

import csv
from pathlib import Path
from typing import TYPE_CHECKING

from app.redis_client import address_cache_delete, address_cache_delete_pattern, address_cache_get, address_cache_set

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


# --- CRUD: create / update / delete (DB only, then invalidate Redis) ---

def _invalidate_regions() -> None:
    address_cache_delete(_CACHE_KEY_REGIONS)


def _invalidate_provinces(region_code: str | None = None) -> None:
    if region_code:
        address_cache_delete(_CACHE_KEY_PROVINCES.format(region_code=region_code))
    else:
        address_cache_delete_pattern("address:provinces:*")


def _invalidate_municipalities(province_code: str | None = None) -> None:
    if province_code:
        address_cache_delete(_CACHE_KEY_MUNICIPALITIES.format(province_code=province_code))
    else:
        address_cache_delete_pattern("address:municipalities:*")


def _invalidate_barangays(municipal_code: str | None = None) -> None:
    if municipal_code:
        address_cache_delete(_CACHE_KEY_BARANGAYS.format(municipal_code=municipal_code))
    else:
        address_cache_delete_pattern("address:barangays:*")


class AddressConflictError(Exception):
    """Raised when delete would violate referential integrity (e.g. region has provinces)."""
    pass


def create_region(db: "Session", code: str, name: str) -> dict[str, str]:
    """Create a region. Invalidates regions cache. Raises on duplicate code."""
    from app.models import AddressRegion
    code = (code or "").strip()[:8]
    name = (name or "").strip()[:255]
    if not code or not name:
        raise ValueError("code and name are required")
    existing = db.query(AddressRegion).filter(AddressRegion.adm1_pcode == code).first()
    if existing:
        raise ValueError(f"Region with code {code!r} already exists")
    row = AddressRegion(adm1_pcode=code, adm1_en=name, adm0_pcode=None)
    db.add(row)
    db.commit()
    db.refresh(row)
    _invalidate_regions()
    return {"code": row.adm1_pcode, "name": row.adm1_en}


def update_region(db: "Session", code: str, name: str) -> dict[str, str]:
    """Update a region name. Invalidates regions cache."""
    from app.models import AddressRegion
    code = (code or "").strip()[:8]
    name = (name or "").strip()[:255]
    if not code or not name:
        raise ValueError("code and name are required")
    row = db.query(AddressRegion).filter(AddressRegion.adm1_pcode == code).first()
    if not row:
        raise ValueError(f"Region with code {code!r} not found")
    row.adm1_en = name
    db.commit()
    db.refresh(row)
    _invalidate_regions()
    return {"code": row.adm1_pcode, "name": row.adm1_en}


def delete_region(db: "Session", code: str) -> None:
    """Delete a region. Fails if it has provinces."""
    from app.models import AddressRegion, AddressProvince
    code = (code or "").strip()[:8]
    if not code:
        raise ValueError("code is required")
    row = db.query(AddressRegion).filter(AddressRegion.adm1_pcode == code).first()
    if not row:
        raise ValueError(f"Region with code {code!r} not found")
    has_provinces = db.query(AddressProvince).filter(AddressProvince.adm1_pcode == code).first() is not None
    if has_provinces:
        raise AddressConflictError("Cannot delete region that has provinces. Delete provinces first.")
    db.delete(row)
    db.commit()
    _invalidate_regions()
    _invalidate_provinces(None)


def create_province(db: "Session", region_code: str, code: str, name: str) -> dict[str, str]:
    """Create a province. Invalidates provinces cache for the region."""
    from app.models import AddressProvince
    region_code = (region_code or "").strip()[:8]
    code = (code or "").strip()[:12]
    name = (name or "").strip()[:255]
    if not region_code or not code or not name:
        raise ValueError("region_code, code and name are required")
    existing = db.query(AddressProvince).filter(AddressProvince.adm2_pcode == code).first()
    if existing:
        raise ValueError(f"Province with code {code!r} already exists")
    row = AddressProvince(adm2_pcode=code, adm2_en=name, adm1_pcode=region_code)
    db.add(row)
    db.commit()
    db.refresh(row)
    _invalidate_provinces(region_code)
    return {"code": row.adm2_pcode, "name": row.adm2_en}


def update_province(db: "Session", code: str, name: str) -> dict[str, str]:
    """Update a province name. Invalidates provinces cache for its region."""
    from app.models import AddressProvince
    code = (code or "").strip()[:12]
    name = (name or "").strip()[:255]
    if not code or not name:
        raise ValueError("code and name are required")
    row = db.query(AddressProvince).filter(AddressProvince.adm2_pcode == code).first()
    if not row:
        raise ValueError(f"Province with code {code!r} not found")
    row.adm2_en = name
    region_code = row.adm1_pcode
    db.commit()
    db.refresh(row)
    _invalidate_provinces(region_code)
    return {"code": row.adm2_pcode, "name": row.adm2_en}


def delete_province(db: "Session", code: str) -> None:
    """Delete a province. Fails if it has municipalities."""
    from app.models import AddressMunicipality, AddressProvince
    code = (code or "").strip()[:12]
    if not code:
        raise ValueError("code is required")
    row = db.query(AddressProvince).filter(AddressProvince.adm2_pcode == code).first()
    if not row:
        raise ValueError(f"Province with code {code!r} not found")
    has_munis = db.query(AddressMunicipality).filter(AddressMunicipality.adm2_pcode == code).first() is not None
    if has_munis:
        raise AddressConflictError("Cannot delete province that has municipalities. Delete municipalities first.")
    db.delete(row)
    db.commit()
    _invalidate_provinces(row.adm1_pcode)


def create_municipality(db: "Session", province_code: str, code: str, name: str) -> dict[str, str]:
    """Create a municipality. Invalidates municipalities cache for the province."""
    from app.models import AddressMunicipality
    province_code = (province_code or "").strip()[:12]
    code = (code or "").strip()[:14]
    name = (name or "").strip()[:255]
    if not province_code or not code or not name:
        raise ValueError("province_code, code and name are required")
    existing = db.query(AddressMunicipality).filter(AddressMunicipality.adm3_pcode == code).first()
    if existing:
        raise ValueError(f"Municipality with code {code!r} already exists")
    row = AddressMunicipality(adm3_pcode=code, adm3_en=name, adm2_pcode=province_code)
    db.add(row)
    db.commit()
    db.refresh(row)
    _invalidate_municipalities(province_code)
    return {"code": row.adm3_pcode, "name": row.adm3_en}


def update_municipality(db: "Session", code: str, name: str) -> dict[str, str]:
    """Update a municipality name. Invalidates municipalities cache for its province."""
    from app.models import AddressMunicipality
    code = (code or "").strip()[:14]
    name = (name or "").strip()[:255]
    if not code or not name:
        raise ValueError("code and name are required")
    row = db.query(AddressMunicipality).filter(AddressMunicipality.adm3_pcode == code).first()
    if not row:
        raise ValueError(f"Municipality with code {code!r} not found")
    row.adm3_en = name
    province_code = row.adm2_pcode
    db.commit()
    db.refresh(row)
    _invalidate_municipalities(province_code)
    return {"code": row.adm3_pcode, "name": row.adm3_en}


def delete_municipality(db: "Session", code: str) -> None:
    """Delete a municipality. Fails if it has barangays."""
    from app.models import AddressBarangay, AddressMunicipality
    code = (code or "").strip()[:14]
    if not code:
        raise ValueError("code is required")
    row = db.query(AddressMunicipality).filter(AddressMunicipality.adm3_pcode == code).first()
    if not row:
        raise ValueError(f"Municipality with code {code!r} not found")
    has_barangays = db.query(AddressBarangay).filter(AddressBarangay.adm3_pcode == code).first() is not None
    if has_barangays:
        raise AddressConflictError("Cannot delete municipality that has barangays. Delete barangays first.")
    db.delete(row)
    db.commit()
    _invalidate_municipalities(row.adm2_pcode)


def create_barangay(db: "Session", municipal_code: str, code: str, name: str) -> dict[str, str]:
    """Create a barangay. Invalidates barangays cache for the municipality."""
    from app.models import AddressBarangay
    municipal_code = (municipal_code or "").strip()[:14]
    code = (code or "").strip()[:16]
    name = (name or "").strip()[:255]
    if not municipal_code or not code or not name:
        raise ValueError("municipal_code, code and name are required")
    existing = db.query(AddressBarangay).filter(AddressBarangay.adm4_pcode == code).first()
    if existing:
        raise ValueError(f"Barangay with code {code!r} already exists")
    row = AddressBarangay(adm4_pcode=code, adm4_en=name, adm3_pcode=municipal_code)
    db.add(row)
    db.commit()
    db.refresh(row)
    _invalidate_barangays(municipal_code)
    return {"code": row.adm4_pcode, "name": row.adm4_en}


def update_barangay(db: "Session", code: str, name: str) -> dict[str, str]:
    """Update a barangay name. Invalidates barangays cache for its municipality."""
    from app.models import AddressBarangay
    code = (code or "").strip()[:16]
    name = (name or "").strip()[:255]
    if not code or not name:
        raise ValueError("code and name are required")
    row = db.query(AddressBarangay).filter(AddressBarangay.adm4_pcode == code).first()
    if not row:
        raise ValueError(f"Barangay with code {code!r} not found")
    row.adm4_en = name
    municipal_code = row.adm3_pcode
    db.commit()
    db.refresh(row)
    _invalidate_barangays(municipal_code)
    return {"code": row.adm4_pcode, "name": row.adm4_en}


def delete_barangay(db: "Session", code: str) -> None:
    """Delete a barangay."""
    from app.models import AddressBarangay
    code = (code or "").strip()[:16]
    if not code:
        raise ValueError("code is required")
    row = db.query(AddressBarangay).filter(AddressBarangay.adm4_pcode == code).first()
    if not row:
        raise ValueError(f"Barangay with code {code!r} not found")
    db.delete(row)
    db.commit()
    _invalidate_barangays(row.adm3_pcode)
