from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ApplicationBase(BaseModel):
    prequalification_no: Optional[str] = None
    origin: Optional[str] = None
    indicator: Optional[str] = None
    tenurial_code: Optional[str] = None
    application_type: Optional[str] = None
    current_addr: Optional[str] = None
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    birth_date: Optional[date] = None
    sex: Optional[str] = None
    civil_status: Optional[str] = None
    address: Optional[str] = None
    valid_id_image: Optional[str] = None
    valid_id_type: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(ApplicationBase):
    pass


class ApplicationResponse(ApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    app_id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
