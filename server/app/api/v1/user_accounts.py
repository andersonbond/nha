from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user_account import UserAccount
from app.schemas.user_account import UserAccountCreate, UserAccountResponse, UserAccountUpdate

router = APIRouter()


@router.get("/", response_model=list[UserAccountResponse])
def list_user_accounts(
    skip: int = 0,
    limit: int = 100,
    is_active: bool | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(UserAccount)
    if is_active is not None:
        q = q.filter(UserAccount.is_active == is_active)
    items = q.offset(skip).limit(limit).all()
    return items


@router.get("/{account_id}", response_model=UserAccountResponse)
def get_user_account(account_id: UUID, db: Session = Depends(get_db)):
    item = db.query(UserAccount).filter(UserAccount.id == account_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="User account not found")
    return item


@router.post("/", response_model=UserAccountResponse, status_code=201)
def create_user_account(payload: UserAccountCreate, db: Session = Depends(get_db)):
    item = UserAccount(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{account_id}", response_model=UserAccountResponse)
def update_user_account(
    account_id: UUID,
    payload: UserAccountUpdate,
    db: Session = Depends(get_db),
):
    item = db.query(UserAccount).filter(UserAccount.id == account_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="User account not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{account_id}", response_model=UserAccountResponse)
def patch_user_account(
    account_id: UUID,
    payload: UserAccountUpdate,
    db: Session = Depends(get_db),
):
    item = db.query(UserAccount).filter(UserAccount.id == account_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="User account not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{account_id}", status_code=204)
def delete_user_account(account_id: UUID, db: Session = Depends(get_db)):
    item = db.query(UserAccount).filter(UserAccount.id == account_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="User account not found")
    db.delete(item)
    db.commit()
    return None
