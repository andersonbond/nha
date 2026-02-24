from sqlalchemy import Column, Date, DateTime, Integer, String, Text

from app.database import Base


class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bin = Column(String(9), nullable=True)
    app_id = Column(String(10), nullable=True)
    last_name = Column(String(25), nullable=True)
    first_name = Column(String(25), nullable=True)
    middle_name = Column(String(25), nullable=True)
    birth_date = Column(Date, nullable=True)
    sex = Column(String(1), nullable=True)
    civil_status = Column(String(1), nullable=True)
    address = Column(Text, nullable=True)
    region_code = Column(String(8), nullable=True)
    province_code = Column(String(12), nullable=True)
    municipal_code = Column(String(14), nullable=True)
    barangay_code = Column(String(16), nullable=True)
    district_code = Column(String(2), nullable=True)
    membership_code = Column(String(1), nullable=True)
    old_common_code = Column(String(20), nullable=True)
    common_code = Column(String(20), nullable=True)
    act_tag = Column(String(1), nullable=True)
    indicator = Column(String(1), nullable=True)
    inp_date = Column(Date, nullable=True)
    ssp = Column(String(1), nullable=True)
    category = Column(String(10), nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
