"""Schemas for address reference data CRUD."""

from pydantic import BaseModel, Field


class AddressItemCreate(BaseModel):
    """Create region: code and name."""
    code: str = Field(..., min_length=1, max_length=8)
    name: str = Field(..., min_length=1, max_length=255)


class AddressItemUpdate(BaseModel):
    """Update name only (code in path)."""
    name: str = Field(..., min_length=1, max_length=255)


class AddressProvinceCreate(BaseModel):
    """Create province: code, name, and parent region."""
    code: str = Field(..., min_length=1, max_length=12)
    name: str = Field(..., min_length=1, max_length=255)
    region_code: str = Field(..., min_length=1, max_length=8)


class AddressMunicipalityCreate(BaseModel):
    """Create municipality: code, name, and parent province."""
    code: str = Field(..., min_length=1, max_length=14)
    name: str = Field(..., min_length=1, max_length=255)
    province_code: str = Field(..., min_length=1, max_length=12)


class AddressBarangayCreate(BaseModel):
    """Create barangay: code, name, and parent municipality."""
    code: str = Field(..., min_length=1, max_length=16)
    name: str = Field(..., min_length=1, max_length=255)
    municipal_code: str = Field(..., min_length=1, max_length=14)
