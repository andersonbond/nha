from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

# DB: Numeric(7,4) => max 999.9999
RATE_MAX = Decimal("999.9999")


class ProgramBase(BaseModel):
    mc_ref: Optional[str] = Field(None, max_length=50)
    interest_rate: Decimal = Field(Decimal("0.0000"), ge=0, le=RATE_MAX)
    delinquency_rate: Decimal = Field(Decimal("0.0000"), ge=0, le=RATE_MAX)
    max_term_yrs: Optional[int] = Field(None, ge=0, le=99)

    @field_validator("interest_rate", "delinquency_rate")
    @classmethod
    def quantize_rate(cls, v: Decimal) -> Decimal:
        return v.quantize(Decimal("0.0001"))


class ProgramCreate(ProgramBase):
    pass


class ProgramUpdate(ProgramBase):
    approval_status: Optional[str] = Field(None, max_length=20)
    approved_by: Optional[str] = Field(None, max_length=255)
    rejection_reason: Optional[str] = None


class ProgramResponse(ProgramBase):
    model_config = ConfigDict(from_attributes=True)

    project_prog_id: int
    approval_status: Optional[str] = None
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    rejection_reason: Optional[str] = None
