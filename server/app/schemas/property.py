from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


class PropertyBase(BaseModel):
    source_geoid: Optional[str] = None
    common_code: Optional[str] = None
    old_common_code: Optional[str] = None
    project_code: Optional[str] = None
    sb_phase: Optional[str] = None
    sb_survey: Optional[str] = None
    sb_block: Optional[str] = None
    sb_lot: Optional[str] = None
    disposition_status: Optional[str] = None
    property_type: Optional[str] = None
    lhc: Optional[str] = None
    development_status: Optional[str] = None
    area_sqm: Optional[Decimal] = None
    tct_no: Optional[str] = None
    tct_date: Optional[date] = None
    price_sqm: Optional[Decimal] = None
    program_class: Optional[Decimal] = None
    mode_disposition: Optional[str] = None
    disposition_date: Optional[date] = None
    disposition_target: Optional[str] = None
    transaction_type: Optional[str] = None
    transaction_date: Optional[date] = None
    sales_report_no: Optional[str] = None
    sales_report_date: Optional[date] = None
    effectivity_date: Optional[date] = None
    production_date: Optional[date] = None
    old_area: Optional[Decimal] = None
    emd_tag: Optional[str] = None
    principal_amount: Optional[Decimal] = None
    house_interest_rate: Optional[Decimal] = None
    house_area_sqm: Optional[Decimal] = None
    house_price: Optional[Decimal] = None
    house_model: Optional[str] = None
    house_downpayment: Optional[Decimal] = None
    house_terms: Optional[Decimal] = None
    house_amortization: Optional[Decimal] = None
    house_input_date: Optional[date] = None
    fvac_occ: Optional[str] = None
    indicator: Optional[str] = None
    inp_date: Optional[date] = None
    ntag: Optional[str] = None
    active_stat: Optional[str] = None


class PropertyCreate(PropertyBase):
    geoid: str


class PropertyUpdate(PropertyBase):
    geoid: Optional[str] = None


class PropertyResponse(PropertyBase):
    model_config = ConfigDict(from_attributes=True)

    geoid: str
