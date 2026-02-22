from decimal import Decimal

from sqlalchemy import Column, DateTime, Integer, Numeric, String, Text

from app.database import Base


class Program(Base):
    __tablename__ = "programs"

    project_prog_id = Column(Integer, primary_key=True, autoincrement=True)
    mc_ref = Column(String(50), nullable=True)
    interest_rate = Column(Numeric(7, 4), nullable=False, default=Decimal("0.0000"))
    delinquency_rate = Column(Numeric(7, 4), nullable=False, default=Decimal("0.0000"))
    max_term_yrs = Column(Integer, nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    approval_status = Column(String(20), server_default="pending_approval", nullable=False)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    approved_by = Column(String(255), nullable=True)
    rejection_reason = Column(Text(), nullable=True)
