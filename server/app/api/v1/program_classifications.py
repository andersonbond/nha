from decimal import Decimal, InvalidOperation

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.program_classification import ProgramClassification
from app.schemas.program_classification import (
    ProgramClassificationCreate,
    ProgramClassificationResponse,
    ProgramClassificationUpdate,
)

router = APIRouter()


def _parse_program_class(value: str) -> Decimal:
    try:
        return Decimal(value)
    except (InvalidOperation, ValueError):
        raise HTTPException(status_code=400, detail="Invalid program_class value")


@router.get("/", response_model=list[ProgramClassificationResponse])
def list_program_classifications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    items = db.query(ProgramClassification).offset(skip).limit(limit).all()
    return items


@router.get("/{program_class}", response_model=ProgramClassificationResponse)
def get_program_classification(program_class: str, db: Session = Depends(get_db)):
    pk = _parse_program_class(program_class)
    item = (
        db.query(ProgramClassification)
        .filter(ProgramClassification.program_class == pk)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Program classification not found")
    return item


@router.post("/", response_model=ProgramClassificationResponse, status_code=201)
def create_program_classification(
    payload: ProgramClassificationCreate, db: Session = Depends(get_db)
):
    item = ProgramClassification(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{program_class}", response_model=ProgramClassificationResponse)
def update_program_classification(
    program_class: str,
    payload: ProgramClassificationUpdate,
    db: Session = Depends(get_db),
):
    pk = _parse_program_class(program_class)
    item = (
        db.query(ProgramClassification)
        .filter(ProgramClassification.program_class == pk)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Program classification not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{program_class}", status_code=204)
def delete_program_classification(program_class: str, db: Session = Depends(get_db)):
    pk = _parse_program_class(program_class)
    item = (
        db.query(ProgramClassification)
        .filter(ProgramClassification.program_class == pk)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Program classification not found")
    db.delete(item)
    db.commit()
    return None
