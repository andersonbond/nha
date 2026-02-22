from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

# DB: Numeric(7,4) => max 999.9999
RATE_MAX = Decimal("999.9999")


def _decimal_7_4(v: Optional[Decimal]) -> Optional[Decimal]:
    if v is None:
        return None
    if v < 0 or v > RATE_MAX:
        raise ValueError(f"Must be between 0 and {RATE_MAX}")
    return v.quantize(Decimal("0.0001"))


def _decimal_non_negative(v: Optional[Decimal]) -> Optional[Decimal]:
    if v is None:
        return None
    if v < 0:
        raise ValueError("Must be >= 0")
    return v


class ProjectBase(BaseModel):
    project_name: Optional[str] = Field(None, max_length=60)
    program_class: Optional[Decimal] = None
    mother_tct: Optional[str] = Field(None, max_length=13)
    sub_tct: Optional[str] = Field(None, max_length=13)
    total_area: Optional[Decimal] = None
    project_cost: Optional[Decimal] = None
    lot_type: Optional[str] = Field(None, max_length=1)
    region_code: Optional[str] = Field(None, max_length=4)
    province_code: Optional[str] = Field(None, max_length=4)
    municipal_code: Optional[str] = Field(None, max_length=4)
    barangay_code: Optional[str] = Field(None, max_length=4)
    district_code: Optional[str] = Field(None, max_length=1)
    office_code: Optional[str] = Field(None, max_length=2)
    indicator: Optional[str] = Field(None, max_length=1)
    inp_date: Optional[date] = None
    project_amo: Optional[str] = Field(None, max_length=1)
    original_po: Optional[str] = Field(None, max_length=25)
    construction_pm: Optional[str] = Field(None, max_length=25)
    depository_bank: Optional[str] = Field(None, max_length=50)
    contract_type: Optional[str] = Field(None, max_length=20)
    record_type: Optional[str] = Field(None, max_length=20)
    amort_type: Optional[str] = Field(None, max_length=10)
    project_prog_id: Optional[int] = None
    grace_period: Optional[str] = Field(None, max_length=1)
    account_type: Optional[str] = Field(None, max_length=20)
    downpayment: Optional[Decimal] = None
    monthly_amortization: Optional[Decimal] = None
    interest_rate: Optional[Decimal] = None
    delinquency_rate: Optional[Decimal] = None
    selling_price: Optional[Decimal] = None
    terms_yr: Optional[int] = Field(None, ge=0)  # no upper bound so existing DB rows (e.g. bad data) still serialize

    @field_validator("total_area", "project_cost", "downpayment", "monthly_amortization", "selling_price")
    @classmethod
    def non_negative_decimal(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        return _decimal_non_negative(v)

    @field_validator("interest_rate", "delinquency_rate")
    @classmethod
    def rate_decimal_7_4(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        return _decimal_7_4(v)


class ProjectCreate(ProjectBase):
    project_code: str = Field(..., min_length=1, max_length=20)

    @field_validator("terms_yr")
    @classmethod
    def terms_yr_range(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and (v < 0 or v > 99):
            raise ValueError("Must be between 0 and 99")
        return v


class ProjectUpdate(ProjectBase):
    @field_validator("terms_yr")
    @classmethod
    def terms_yr_range(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and (v < 0 or v > 99):
            raise ValueError("Must be between 0 and 99")
        return v


class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    project_code: str
    created_at: Optional[datetime] = None
