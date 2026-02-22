from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.beneficiary import Beneficiary
from app.schemas.beneficiary import BeneficiaryCreate, BeneficiaryResponse, BeneficiaryUpdate

router = APIRouter()


def _not_deleted(q):
    return q.filter(Beneficiary.deleted_at.is_(None))


@router.get("/", response_model=list[BeneficiaryResponse])
def list_beneficiaries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    items = _not_deleted(db.query(Beneficiary)).offset(skip).limit(limit).all()
    return items


@router.get("/{beneficiary_id}", response_model=BeneficiaryResponse)
def get_beneficiary(beneficiary_id: int, db: Session = Depends(get_db)):
    item = _not_deleted(db.query(Beneficiary)).filter(Beneficiary.id == beneficiary_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    return item


@router.post("/", response_model=BeneficiaryResponse, status_code=201)
def create_beneficiary(payload: BeneficiaryCreate, db: Session = Depends(get_db)):
    item = Beneficiary(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{beneficiary_id}", response_model=BeneficiaryResponse)
def update_beneficiary(
    beneficiary_id: int,
    payload: BeneficiaryUpdate,
    db: Session = Depends(get_db),
):
    item = _not_deleted(db.query(Beneficiary)).filter(Beneficiary.id == beneficiary_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{beneficiary_id}", status_code=204)
def delete_beneficiary(beneficiary_id: int, db: Session = Depends(get_db)):
    item = _not_deleted(db.query(Beneficiary)).filter(Beneficiary.id == beneficiary_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    item.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return None
