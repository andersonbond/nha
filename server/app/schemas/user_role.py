from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class UserRoleBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=64)
    description: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_stripped(cls, v: str) -> str:
        return v.strip() if v else v


class UserRoleCreate(UserRoleBase):
    pass


class UserRoleUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=64)
    description: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_stripped(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v


class UserRoleResponse(UserRoleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
