from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationUpdate

router = APIRouter()


@router.get("/", response_model=list[ApplicationResponse])
def list_applications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    items = db.query(Application).offset(skip).limit(limit).all()
    return items


@router.get("/{app_id}", response_model=ApplicationResponse)
def get_application(app_id: UUID, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.app_id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.post("/", response_model=ApplicationResponse, status_code=201)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    app = Application(**payload.model_dump())
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.put("/{app_id}", response_model=ApplicationResponse)
def update_application(
    app_id: UUID,
    payload: ApplicationUpdate,
    db: Session = Depends(get_db),
):
    app = db.query(Application).filter(Application.app_id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(app, key, value)
    db.commit()
    db.refresh(app)
    return app


@router.delete("/{app_id}", status_code=204)
def delete_application(app_id: UUID, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.app_id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()
    return None
