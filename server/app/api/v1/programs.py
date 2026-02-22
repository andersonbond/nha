from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.program import Program
from app.schemas.program import ProgramCreate, ProgramResponse, ProgramUpdate

router = APIRouter()


def _not_deleted(q):
    return q.filter(Program.deleted_at.is_(None))


@router.get("/", response_model=list[ProgramResponse])
def list_programs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    items = _not_deleted(db.query(Program)).offset(skip).limit(limit).all()
    return items


@router.get("/{project_prog_id}", response_model=ProgramResponse)
def get_program(project_prog_id: int, db: Session = Depends(get_db)):
    item = _not_deleted(db.query(Program)).filter(Program.project_prog_id == project_prog_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Program not found")
    return item


@router.post("/", response_model=ProgramResponse, status_code=201)
def create_program(payload: ProgramCreate, db: Session = Depends(get_db)):
    item = Program(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{project_prog_id}", response_model=ProgramResponse)
def update_program(
    project_prog_id: int,
    payload: ProgramUpdate,
    db: Session = Depends(get_db),
):
    item = _not_deleted(db.query(Program)).filter(Program.project_prog_id == project_prog_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Program not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{project_prog_id}", status_code=204)
def delete_program(project_prog_id: int, db: Session = Depends(get_db)):
    item = _not_deleted(db.query(Program)).filter(Program.project_prog_id == project_prog_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Program not found")
    item.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return None
