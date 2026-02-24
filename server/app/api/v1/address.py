"""Address API: regions, provinces, municipalities, barangays. Redis-first, then DB or CSV."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.address_service import (
    get_barangays,
    get_municipalities,
    get_provinces,
    get_regions,
    warm_address_cache,
)

router = APIRouter()


@router.get("/regions")
def list_regions(db: Session = Depends(get_db)) -> list[dict[str, str]]:
    """List all regions. Response: [{ \"code\", \"name\" }, ...]."""
    return get_regions(db)


@router.get("/provinces")
def list_provinces(
    region_code: str = Query(..., alias="region_code"),
    db: Session = Depends(get_db),
) -> list[dict[str, str]]:
    """List provinces for a region. Response: [{ \"code\", \"name\" }, ...]."""
    return get_provinces(region_code, db)


@router.get("/municipalities")
def list_municipalities(
    province_code: str = Query(..., alias="province_code"),
    db: Session = Depends(get_db),
) -> list[dict[str, str]]:
    """List municipalities for a province. Response: [{ \"code\", \"name\" }, ...]."""
    return get_municipalities(province_code, db)


@router.get("/barangays")
def list_barangays(
    municipal_code: str = Query(..., alias="municipal_code"),
    db: Session = Depends(get_db),
) -> list[dict[str, str]]:
    """List barangays for a municipality. Response: [{ \"code\", \"name\" }, ...]."""
    return get_barangays(municipal_code, db)


@router.post("/warm")
def warm_cache(db: Session = Depends(get_db)) -> dict[str, str]:
    """Preload all address data into Redis from DB/CSV. No-op if Redis unavailable."""
    warm_address_cache(db)
    return {"status": "ok"}
