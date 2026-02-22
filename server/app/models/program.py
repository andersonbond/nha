from decimal import Decimal

from sqlalchemy import Column, DateTime, Integer, Numeric, String

from app.database import Base


class Program(Base):
    __tablename__ = "programs"

    project_prog_id = Column(Integer, primary_key=True, autoincrement=True)
    mc_ref = Column(String(50), nullable=True)
    interest_rate = Column(Numeric(7, 4), nullable=False, default=Decimal("0.0000"))
    delinquency_rate = Column(Numeric(7, 4), nullable=False, default=Decimal("0.0000"))
    max_term_yrs = Column(Integer, nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
