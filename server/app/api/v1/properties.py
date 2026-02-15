from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyResponse, PropertyUpdate

router = APIRouter()


@router.get("/", response_model=list[PropertyResponse])
def list_properties(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    items = db.query(Property).offset(skip).limit(limit).all()
    return items


@router.get("/{geoid}", response_model=PropertyResponse)
def get_property(geoid: str, db: Session = Depends(get_db)):
    item = db.query(Property).filter(Property.geoid == geoid).first()
    if not item:
        raise HTTPException(status_code=404, detail="Property not found")
    return item


@router.post("/", response_model=PropertyResponse, status_code=201)
def create_property(payload: PropertyCreate, db: Session = Depends(get_db)):
    item = Property(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{geoid}", response_model=PropertyResponse)
def update_property(
    geoid: str,
    payload: PropertyUpdate,
    db: Session = Depends(get_db),
):
    item = db.query(Property).filter(Property.geoid == geoid).first()
    if not item:
        raise HTTPException(status_code=404, detail="Property not found")
    data = payload.model_dump(exclude_unset=True)
    if "geoid" in data and data["geoid"] != geoid:
        raise HTTPException(
            status_code=400, detail="Cannot change geoid; use delete and create instead"
        )
    for key, value in data.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{geoid}", status_code=204)
def delete_property(geoid: str, db: Session = Depends(get_db)):
    item = db.query(Property).filter(Property.geoid == geoid).first()
    if not item:
        raise HTTPException(status_code=404, detail="Property not found")
    db.delete(item)
    db.commit()
    return None
