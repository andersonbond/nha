import uuid
from datetime import datetime
from sqlalchemy import Column, Date, DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Application(Base):
    __tablename__ = "applications"

    app_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prequalification_no = Column(String(255), nullable=True)
    origin = Column(String(255), nullable=True)
    indicator = Column(String(255), nullable=True)
    tenurial_code = Column(String(64), nullable=True)
    application_type = Column(String(64), nullable=True)
    current_addr = Column(Text, nullable=True)
    last_name = Column(String(255), nullable=True)
    first_name = Column(String(255), nullable=True)
    middle_name = Column(String(255), nullable=True)
    birth_date = Column(Date, nullable=True)
    sex = Column(String(32), nullable=True)
    civil_status = Column(String(64), nullable=True)
    address = Column(Text, nullable=True)
    region_code = Column(String(8), nullable=True)
    province_code = Column(String(12), nullable=True)
    municipal_code = Column(String(14), nullable=True)
    barangay_code = Column(String(16), nullable=True)
    district_code = Column(String(2), nullable=True)
    valid_id_image = Column(Text, nullable=True)
    valid_id_type = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
