from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict


class BeneficiaryBase(BaseModel):
    bin: Optional[str] = None
    app_id: Optional[str] = None
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    birth_date: Optional[date] = None
    sex: Optional[str] = None
    civil_status: Optional[str] = None
    address: Optional[str] = None
    region_code: Optional[str] = None
    province_code: Optional[str] = None
    municipal_code: Optional[str] = None
    barangay_code: Optional[str] = None
    district_code: Optional[str] = None
    membership_code: Optional[str] = None
    old_common_code: Optional[str] = None
    common_code: Optional[str] = None
    act_tag: Optional[str] = None
    indicator: Optional[str] = None
    inp_date: Optional[date] = None
    ssp: Optional[str] = None
    category: Optional[str] = None


class BeneficiaryCreate(BeneficiaryBase):
    pass


class BeneficiaryUpdate(BeneficiaryBase):
    pass


class BeneficiaryResponse(BeneficiaryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
