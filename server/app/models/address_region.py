from sqlalchemy import Column, String

from app.database import Base


class AddressRegion(Base):
    __tablename__ = "address_regions"

    adm1_pcode = Column(String(8), primary_key=True)
    adm1_en = Column(String(255), nullable=False)
    adm0_pcode = Column(String(4), nullable=True)


class AddressProvince(Base):
    __tablename__ = "address_provinces"

    adm2_pcode = Column(String(12), primary_key=True)
    adm2_en = Column(String(255), nullable=False)
    adm1_pcode = Column(String(8), nullable=False)


class AddressMunicipality(Base):
    __tablename__ = "address_municipalities"

    adm3_pcode = Column(String(14), primary_key=True)
    adm3_en = Column(String(255), nullable=False)
    adm2_pcode = Column(String(12), nullable=False)


class AddressBarangay(Base):
    __tablename__ = "address_barangays"

    adm4_pcode = Column(String(16), primary_key=True)
    adm4_en = Column(String(255), nullable=False)
    adm3_pcode = Column(String(14), nullable=False)
