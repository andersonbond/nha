from sqlalchemy import Column, Date, DateTime, Integer, Numeric, String, text

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    project_code = Column(String(20), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"), nullable=True)
    project_name = Column(String(60), nullable=True)
    program_class = Column(Numeric(5, 2), nullable=True)
    mother_tct = Column(String(13), nullable=True)
    sub_tct = Column(String(13), nullable=True)
    total_area = Column(Numeric(15, 2), nullable=True)
    project_cost = Column(Numeric(11, 2), nullable=True)
    lot_type = Column(String(1), nullable=True)
    region_code = Column(String(4), nullable=True)
    province_code = Column(String(4), nullable=True)
    municipal_code = Column(String(4), nullable=True)
    barangay_code = Column(String(4), nullable=True)
    district_code = Column(String(1), nullable=True)
    office_code = Column(String(2), nullable=True)
    indicator = Column(String(1), nullable=True)
    inp_date = Column(Date, nullable=True)
    project_amo = Column(String(1), nullable=True)
    original_po = Column(String(25), nullable=True)
    construction_pm = Column(String(25), nullable=True)
    depository_bank = Column(String(50), nullable=True)
    contract_type = Column(String(20), nullable=True)
    record_type = Column(String(20), nullable=True)
    amort_type = Column(String(10), nullable=True)
    project_prog_id = Column(Integer, nullable=True)
    grace_period = Column(String(1), nullable=True)
    account_type = Column(String(20), nullable=True)
    downpayment = Column(Numeric(11, 2), nullable=True)
    monthly_amortization = Column(Numeric(11, 2), nullable=True)
    interest_rate = Column(Numeric(7, 4), nullable=True)
    delinquency_rate = Column(Numeric(7, 4), nullable=True)
    selling_price = Column(Numeric(15, 2), nullable=True)
    terms_yr = Column(Integer, nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
