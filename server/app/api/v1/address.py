"""Address API: regions, provinces, municipalities, barangays. Redis-first, then DB or CSV."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.address import (
    AddressBarangayCreate,
    AddressItemCreate,
    AddressItemUpdate,
    AddressMunicipalityCreate,
    AddressProvinceCreate,
)
from app.services.address_service import (
    AddressConflictError,
    create_barangay,
    create_municipality,
    create_province,
    create_region,
    delete_barangay,
    delete_municipality,
    delete_province,
    delete_region,
    get_barangays,
    get_municipalities,
    get_provinces,
    get_regions,
    update_barangay,
    update_municipality,
    update_province,
    update_region,
    warm_address_cache,
)

router = APIRouter()


def _handle_address_error(e: Exception) -> None:
    if isinstance(e, AddressConflictError):
        raise HTTPException(status_code=409, detail=str(e))
    if isinstance(e, ValueError):
        raise HTTPException(status_code=400, detail=str(e))
    raise e


@router.get("/regions")
def list_regions(db: Session = Depends(get_db)) -> list[dict[str, str]]:
    """List all regions. Response: [{ \"code\", \"name\" }, ...]."""
    return get_regions(db)


@router.post("/regions", status_code=201)
def post_region(payload: AddressItemCreate, db: Session = Depends(get_db)) -> dict[str, str]:
    """Create a region."""
    try:
        return create_region(db, payload.code.strip(), payload.name.strip())
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.patch("/regions/{code}")
def patch_region(code: str, payload: AddressItemUpdate, db: Session = Depends(get_db)) -> dict[str, str]:
    """Update a region name."""
    try:
        return update_region(db, code.strip(), payload.name.strip())
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.delete("/regions/{code}", status_code=204)
def delete_region_route(code: str, db: Session = Depends(get_db)) -> None:
    """Delete a region. Fails if it has provinces."""
    try:
        delete_region(db, code.strip())
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.get("/provinces")
def list_provinces(
    region_code: str = Query(..., alias="region_code"),
    db: Session = Depends(get_db),
) -> list[dict[str, str]]:
    """List provinces for a region. Response: [{ \"code\", \"name\" }, ...]."""
    return get_provinces(region_code, db)


@router.post("/provinces", status_code=201)
def post_province(payload: AddressProvinceCreate, db: Session = Depends(get_db)) -> dict[str, str]:
    """Create a province."""
    try:
        return create_province(
            db,
            payload.region_code.strip(),
            payload.code.strip(),
            payload.name.strip(),
        )
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.patch("/provinces/{code}")
def patch_province(code: str, payload: AddressItemUpdate, db: Session = Depends(get_db)) -> dict[str, str]:
    """Update a province name."""
    try:
        return update_province(db, code.strip(), payload.name.strip())
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.delete("/provinces/{code}", status_code=204)
def delete_province_route(code: str, db: Session = Depends(get_db)) -> None:
    """Delete a province. Fails if it has municipalities."""
    try:
        delete_province(db, code.strip())
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.get("/municipalities")
def list_municipalities(
    province_code: str = Query(..., alias="province_code"),
    db: Session = Depends(get_db),
) -> list[dict[str, str]]:
    """List municipalities for a province. Response: [{ \"code\", \"name\" }, ...]."""
    return get_municipalities(province_code, db)


@router.post("/municipalities", status_code=201)
def post_municipality(payload: AddressMunicipalityCreate, db: Session = Depends(get_db)) -> dict[str, str]:
    """Create a municipality."""
    try:
        return create_municipality(
            db,
            payload.province_code.strip(),
            payload.code.strip(),
            payload.name.strip(),
        )
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.patch("/municipalities/{code}")
def patch_municipality(code: str, payload: AddressItemUpdate, db: Session = Depends(get_db)) -> dict[str, str]:
    """Update a municipality name."""
    try:
        return update_municipality(db, code.strip(), payload.name.strip())
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.delete("/municipalities/{code}", status_code=204)
def delete_municipality_route(code: str, db: Session = Depends(get_db)) -> None:
    """Delete a municipality. Fails if it has barangays."""
    try:
        delete_municipality(db, code.strip())
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.get("/barangays")
def list_barangays(
    municipal_code: str = Query(..., alias="municipal_code"),
    db: Session = Depends(get_db),
) -> list[dict[str, str]]:
    """List barangays for a municipality. Response: [{ \"code\", \"name\" }, ...]."""
    return get_barangays(municipal_code, db)


@router.post("/barangays", status_code=201)
def post_barangay(payload: AddressBarangayCreate, db: Session = Depends(get_db)) -> dict[str, str]:
    """Create a barangay."""
    try:
        return create_barangay(
            db,
            payload.municipal_code.strip(),
            payload.code.strip(),
            payload.name.strip(),
        )
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.patch("/barangays/{code}")
def patch_barangay(code: str, payload: AddressItemUpdate, db: Session = Depends(get_db)) -> dict[str, str]:
    """Update a barangay name."""
    try:
        return update_barangay(db, code.strip(), payload.name.strip())
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.delete("/barangays/{code}", status_code=204)
def delete_barangay_route(code: str, db: Session = Depends(get_db)) -> None:
    """Delete a barangay."""
    try:
        delete_barangay(db, code.strip())
    except (ValueError, AddressConflictError) as e:
        _handle_address_error(e)


@router.post("/warm")
def warm_cache(db: Session = Depends(get_db)) -> dict[str, str]:
    """Preload all address data into Redis from DB/CSV. No-op if Redis unavailable."""
    warm_address_cache(db)
    return {"status": "ok"}
