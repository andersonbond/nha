from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProgramClassificationBase(BaseModel):
    description: Optional[str] = None
    program_code: Optional[str] = None


class ProgramClassificationCreate(ProgramClassificationBase):
    program_class: Decimal


class ProgramClassificationUpdate(ProgramClassificationBase):
    pass


class ProgramClassificationResponse(ProgramClassificationBase):
    model_config = ConfigDict(from_attributes=True)

    program_class: Decimal
