from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class UserAccountBase(BaseModel):
    sso_identifier: str = Field(..., min_length=1, max_length=255)
    email: Optional[str] = Field(None, max_length=255)
    display_name: Optional[str] = Field(None, max_length=255)
    is_active: bool = True

    @field_validator("sso_identifier")
    @classmethod
    def sso_stripped(cls, v: str) -> str:
        return v.strip() if v else v


class UserAccountCreate(UserAccountBase):
    pass


class UserAccountUpdate(BaseModel):
    email: Optional[str] = Field(None, max_length=255)
    display_name: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None


class UserAccountResponse(UserAccountBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
