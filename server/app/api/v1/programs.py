from datetime import datetime, timezone
from typing import Optional

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
    approval_status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = _not_deleted(db.query(Program))
    if approval_status is not None and approval_status.strip():
        q = q.filter(Program.approval_status == approval_status.strip())
    items = q.offset(skip).limit(limit).all()
    return items


@router.get("/{project_prog_id}", response_model=ProgramResponse)
def get_program(project_prog_id: int, db: Session = Depends(get_db)):
    item = _not_deleted(db.query(Program)).filter(Program.project_prog_id == project_prog_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Program not found")
    return item


@router.post("/", response_model=ProgramResponse, status_code=201)
def create_program(payload: ProgramCreate, db: Session = Depends(get_db)):
    data = payload.model_dump()
    data.setdefault("approval_status", "pending_approval")
    item = Program(**data)
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


@router.patch("/{project_prog_id}", response_model=ProgramResponse)
def patch_program(
    project_prog_id: int,
    payload: ProgramUpdate,
    db: Session = Depends(get_db),
):
    item = _not_deleted(db.query(Program)).filter(Program.project_prog_id == project_prog_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Program not found")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(item, key, value)
    if "approval_status" in data and data["approval_status"] == "approved":
        item.approved_at = datetime.now(timezone.utc)
        if "approved_by" in data:
            item.approved_by = data["approved_by"]
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
