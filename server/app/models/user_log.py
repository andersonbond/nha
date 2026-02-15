import uuid
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.database import Base


class UserLog(Base):
    __tablename__ = "user_log"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_identifier = Column(String(255), nullable=True)
    action = Column(String(64), nullable=False)
    ip_address = Column(String(45), nullable=True)
    device = Column(String(255), nullable=True)
    user_agent = Column(Text, nullable=True)
    success = Column(Boolean, nullable=True)
    session_id = Column(String(255), nullable=True)
    details = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
