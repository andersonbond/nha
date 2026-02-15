from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.co_owner import CoOwner
from app.schemas.co_owner import CoOwnerCreate, CoOwnerResponse, CoOwnerUpdate

router = APIRouter()


@router.get("/", response_model=list[CoOwnerResponse])
def list_co_owners(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    items = db.query(CoOwner).offset(skip).limit(limit).all()
    return items


@router.get("/{co_owner_id}", response_model=CoOwnerResponse)
def get_co_owner(co_owner_id: int, db: Session = Depends(get_db)):
    item = db.query(CoOwner).filter(CoOwner.id == co_owner_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Co-owner not found")
    return item


@router.post("/", response_model=CoOwnerResponse, status_code=201)
def create_co_owner(payload: CoOwnerCreate, db: Session = Depends(get_db)):
    item = CoOwner(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{co_owner_id}", response_model=CoOwnerResponse)
def update_co_owner(
    co_owner_id: int,
    payload: CoOwnerUpdate,
    db: Session = Depends(get_db),
):
    item = db.query(CoOwner).filter(CoOwner.id == co_owner_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Co-owner not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{co_owner_id}", status_code=204)
def delete_co_owner(co_owner_id: int, db: Session = Depends(get_db)):
    item = db.query(CoOwner).filter(CoOwner.id == co_owner_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Co-owner not found")
    db.delete(item)
    db.commit()
    return None
