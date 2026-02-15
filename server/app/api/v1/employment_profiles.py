from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employment_profile import EmploymentProfile
from app.schemas.employment_profile import (
    EmploymentProfileCreate,
    EmploymentProfileResponse,
    EmploymentProfileUpdate,
)

router = APIRouter()


@router.get("/", response_model=list[EmploymentProfileResponse])
def list_employment_profiles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    items = db.query(EmploymentProfile).offset(skip).limit(limit).all()
    return items


@router.get("/{profile_id}", response_model=EmploymentProfileResponse)
def get_employment_profile(profile_id: int, db: Session = Depends(get_db)):
    item = db.query(EmploymentProfile).filter(EmploymentProfile.id == profile_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Employment profile not found")
    return item


@router.post("/", response_model=EmploymentProfileResponse, status_code=201)
def create_employment_profile(
    payload: EmploymentProfileCreate, db: Session = Depends(get_db)
):
    item = EmploymentProfile(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{profile_id}", response_model=EmploymentProfileResponse)
def update_employment_profile(
    profile_id: int,
    payload: EmploymentProfileUpdate,
    db: Session = Depends(get_db),
):
    item = db.query(EmploymentProfile).filter(EmploymentProfile.id == profile_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Employment profile not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{profile_id}", status_code=204)
def delete_employment_profile(profile_id: int, db: Session = Depends(get_db)):
    item = db.query(EmploymentProfile).filter(EmploymentProfile.id == profile_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Employment profile not found")
    db.delete(item)
    db.commit()
    return None
