from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate

router = APIRouter()


def _not_deleted(q):
    return q.filter(Project.deleted_at.is_(None))


@router.get("/", response_model=list[ProjectResponse])
def list_projects(
    skip: int = 0,
    limit: int = 100,
    project_code: Optional[str] = None,
    project_name: Optional[str] = None,
    region_code: Optional[str] = None,
    province_code: Optional[str] = None,
    lot_type: Optional[str] = None,
    project_prog_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    q = _not_deleted(db.query(Project))
    if project_code is not None and project_code.strip():
        q = q.filter(Project.project_code.ilike(f"%{project_code.strip()}%"))
    if project_name is not None and project_name.strip():
        q = q.filter(Project.project_name.ilike(f"%{project_name.strip()}%"))
    if region_code is not None and region_code.strip():
        q = q.filter(Project.region_code.ilike(f"%{region_code.strip()}%"))
    if province_code is not None and province_code.strip():
        q = q.filter(Project.province_code.ilike(f"%{province_code.strip()}%"))
    if lot_type is not None and lot_type.strip():
        q = q.filter(Project.lot_type == lot_type.strip())
    if project_prog_id is not None:
        q = q.filter(Project.project_prog_id == project_prog_id)
    items = q.offset(skip).limit(limit).all()
    return items


@router.get("/{project_code}", response_model=ProjectResponse)
def get_project(project_code: str, db: Session = Depends(get_db)):
    item = _not_deleted(db.query(Project)).filter(Project.project_code == project_code).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return item


@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    item = Project(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{project_code}", response_model=ProjectResponse)
def update_project(
    project_code: str,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
):
    item = _not_deleted(db.query(Project)).filter(Project.project_code == project_code).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{project_code}", status_code=204)
def delete_project(project_code: str, db: Session = Depends(get_db)):
    item = _not_deleted(db.query(Project)).filter(Project.project_code == project_code).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    item.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return None
