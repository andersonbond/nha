from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict


class CoOwnerBase(BaseModel):
    beneficiary_id: Optional[int] = None
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    birth_date: Optional[date] = None
    sex: Optional[str] = None
    civil_status: Optional[str] = None
    relationship_type: Optional[str] = None
    sequence: Optional[int] = None
    address1: Optional[str] = None
    address2: Optional[str] = None
    spouse_last_name: Optional[str] = None
    spouse_first_name: Optional[str] = None
    spouse_middle_name: Optional[str] = None
    spouse_birth_date: Optional[date] = None
    membership_code: Optional[str] = None
    ssp: Optional[str] = None
    category: Optional[str] = None


class CoOwnerCreate(CoOwnerBase):
    pass


class CoOwnerUpdate(CoOwnerBase):
    pass


class CoOwnerResponse(CoOwnerBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
