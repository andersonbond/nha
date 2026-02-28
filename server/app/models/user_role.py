from sqlalchemy import Column, DateTime, SmallInteger, String, Text, text
from sqlalchemy.orm import relationship

from app.database import Base


class UserRole(Base):
    __tablename__ = "user_roles"

    id = Column(SmallInteger, primary_key=True, autoincrement=True)
    name = Column(String(64), nullable=False, unique=True)
    description = Column(Text(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"), nullable=True)

    account_roles = relationship(
        "UserAccountRole",
        back_populates="role",
        cascade="all, delete-orphan",
    )
