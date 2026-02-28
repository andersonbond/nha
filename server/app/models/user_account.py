import uuid

from sqlalchemy import Boolean, Column, DateTime, String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class UserAccount(Base):
    __tablename__ = "user_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sso_identifier = Column(String(255), nullable=False, unique=True)
    email = Column(String(255), nullable=True)
    display_name = Column(String(255), nullable=True)
    is_active = Column(Boolean(), server_default=text("true"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"), nullable=True)

    account_roles = relationship(
        "UserAccountRole",
        back_populates="user_account",
        cascade="all, delete-orphan",
    )
