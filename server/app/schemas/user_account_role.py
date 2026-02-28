from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class UserAccountRoleCreate(BaseModel):
    user_account_id: UUID
    role_id: int = Field(..., ge=0)


class UserAccountRoleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_account_id: UUID
    role_id: int
    created_at: Optional[datetime] = None
