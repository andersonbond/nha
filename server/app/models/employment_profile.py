from sqlalchemy import Column, ForeignKey, Integer, Numeric, String

from app.database import Base


class EmploymentProfile(Base):
    __tablename__ = "employment_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id"), nullable=True)
    education_code = Column(String(1), nullable=True)
    employer = Column(String(20), nullable=True)
    position = Column(String(15), nullable=True)
    monthly_income = Column(Numeric(10, 2), nullable=True)
    monthly_expense = Column(Numeric(10, 2), nullable=True)
    no_household_members = Column(Integer, nullable=True)
