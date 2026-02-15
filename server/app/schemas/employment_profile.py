from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


class EmploymentProfileBase(BaseModel):
    beneficiary_id: Optional[int] = None
    education_code: Optional[str] = None
    employer: Optional[str] = None
    position: Optional[str] = None
    monthly_income: Optional[Decimal] = None
    monthly_expense: Optional[Decimal] = None
    no_household_members: Optional[int] = None


class EmploymentProfileCreate(EmploymentProfileBase):
    pass


class EmploymentProfileUpdate(EmploymentProfileBase):
    pass


class EmploymentProfileResponse(EmploymentProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
