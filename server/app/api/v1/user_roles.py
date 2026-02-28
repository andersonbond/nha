from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user_role import UserRole
from app.schemas.user_role import UserRoleCreate, UserRoleResponse, UserRoleUpdate

router = APIRouter()


@router.get("/", response_model=list[UserRoleResponse])
def list_user_roles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    items = db.query(UserRole).offset(skip).limit(limit).all()
    return items


@router.get("/{role_id}", response_model=UserRoleResponse)
def get_user_role(role_id: int, db: Session = Depends(get_db)):
    item = db.query(UserRole).filter(UserRole.id == role_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="User role not found")
    return item


@router.post("/", response_model=UserRoleResponse, status_code=201)
def create_user_role(payload: UserRoleCreate, db: Session = Depends(get_db)):
    item = UserRole(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{role_id}", response_model=UserRoleResponse)
def update_user_role(
    role_id: int,
    payload: UserRoleUpdate,
    db: Session = Depends(get_db),
):
    item = db.query(UserRole).filter(UserRole.id == role_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="User role not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{role_id}", response_model=UserRoleResponse)
def patch_user_role(
    role_id: int,
    payload: UserRoleUpdate,
    db: Session = Depends(get_db),
):
    item = db.query(UserRole).filter(UserRole.id == role_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="User role not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{role_id}", status_code=204)
def delete_user_role(role_id: int, db: Session = Depends(get_db)):
    item = db.query(UserRole).filter(UserRole.id == role_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="User role not found")
    db.delete(item)
    db.commit()
    return None
