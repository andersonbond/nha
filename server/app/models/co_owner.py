from sqlalchemy import Column, Date, ForeignKey, Integer, String

from app.database import Base


class CoOwner(Base):
    __tablename__ = "co_owners"

    id = Column(Integer, primary_key=True, autoincrement=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id"), nullable=True)
    last_name = Column(String(25), nullable=True)
    first_name = Column(String(25), nullable=True)
    middle_name = Column(String(25), nullable=True)
    birth_date = Column(Date, nullable=True)
    sex = Column(String(1), nullable=True)
    civil_status = Column(String(1), nullable=True)
    relationship_type = Column(String(1), nullable=True)
    sequence = Column(Integer, nullable=True)
    address1 = Column(String(30), nullable=True)
    address2 = Column(String(30), nullable=True)
    spouse_last_name = Column(String(25), nullable=True)
    spouse_first_name = Column(String(25), nullable=True)
    spouse_middle_name = Column(String(25), nullable=True)
    spouse_birth_date = Column(Date, nullable=True)
    membership_code = Column(String(1), nullable=True)
    ssp = Column(String(1), nullable=True)
    category = Column(String(10), nullable=True)
