from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user_account import UserAccount
from app.models.user_account_role import UserAccountRole
from app.models.user_role import UserRole
from app.schemas.user_account_role import UserAccountRoleCreate, UserAccountRoleResponse

router = APIRouter()


@router.get("/", response_model=list[UserAccountRoleResponse])
def list_user_account_roles(
    skip: int = 0,
    limit: int = 100,
    user_account_id: Optional[UUID] = Query(None, description="Filter by user account"),
    role_id: Optional[int] = Query(None, description="Filter by role"),
    db: Session = Depends(get_db),
):
    q = db.query(UserAccountRole)
    if user_account_id is not None:
        q = q.filter(UserAccountRole.user_account_id == user_account_id)
    if role_id is not None:
        q = q.filter(UserAccountRole.role_id == role_id)
    items = q.offset(skip).limit(limit).all()
    return items


@router.get("/{user_account_id}/{role_id}", response_model=UserAccountRoleResponse)
def get_user_account_role(
    user_account_id: UUID,
    role_id: int,
    db: Session = Depends(get_db),
):
    item = (
        db.query(UserAccountRole)
        .filter(
            UserAccountRole.user_account_id == user_account_id,
            UserAccountRole.role_id == role_id,
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="User account role not found")
    return item


@router.post("/", response_model=UserAccountRoleResponse, status_code=201)
def create_user_account_role(
    payload: UserAccountRoleCreate,
    db: Session = Depends(get_db),
):
    # Ensure user account and role exist
    account = db.query(UserAccount).filter(UserAccount.id == payload.user_account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="User account not found")
    role = db.query(UserRole).filter(UserRole.id == payload.role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="User role not found")
    existing = (
        db.query(UserAccountRole)
        .filter(
            UserAccountRole.user_account_id == payload.user_account_id,
            UserAccountRole.role_id == payload.role_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=409,
            detail="This role is already assigned to the user account",
        )
    item = UserAccountRole(
        user_account_id=payload.user_account_id,
        role_id=payload.role_id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{user_account_id}/{role_id}", status_code=204)
def delete_user_account_role(
    user_account_id: UUID,
    role_id: int,
    db: Session = Depends(get_db),
):
    item = (
        db.query(UserAccountRole)
        .filter(
            UserAccountRole.user_account_id == user_account_id,
            UserAccountRole.role_id == role_id,
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="User account role not found")
    db.delete(item)
    db.commit()
    return None
