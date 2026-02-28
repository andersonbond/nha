from sqlalchemy import Column, DateTime, ForeignKey, SmallInteger, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class UserAccountRole(Base):
    __tablename__ = "user_account_roles"

    user_account_id = Column(
        UUID(as_uuid=True),
        ForeignKey("user_accounts.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    role_id = Column(
        SmallInteger,
        ForeignKey("user_roles.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    created_at = Column(DateTime(timezone=True), server_default=text("now()"), nullable=True)

    user_account = relationship("UserAccount", back_populates="account_roles")
    role = relationship("UserRole", back_populates="account_roles")
