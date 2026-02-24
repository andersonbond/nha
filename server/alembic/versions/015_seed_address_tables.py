"""seed address tables from CSV

Revision ID: 015
Revises: 014
Create Date: 2026-02-05

"""
import csv
from pathlib import Path
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "015"
down_revision: Union[str, Sequence[str], None] = "014"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# address_data is server/address_data; migrations live in server/alembic/versions
_ADDRESS_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "address_data"


def _load_csv(name: str) -> list[dict]:
    path = _ADDRESS_DATA_DIR / name
    if not path.exists():
        return []
    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            rows.append({k: (v.strip() if v else "") for k, v in row.items()})
    return rows


def upgrade() -> None:
    conn = op.get_bind()
    ins_regions = sa.text(
        "INSERT INTO address_regions (adm1_pcode, adm1_en, adm0_pcode) VALUES (:adm1_pcode, :adm1_en, :adm0_pcode) ON CONFLICT (adm1_pcode) DO NOTHING"
    )
    for r in _load_csv("adm1_regions.csv"):
        conn.execute(ins_regions, {"adm1_pcode": r.get("adm1_pcode", ""), "adm1_en": r.get("adm1_en", ""), "adm0_pcode": r.get("adm0_pcode", "")})
    ins_provinces = sa.text(
        "INSERT INTO address_provinces (adm2_pcode, adm2_en, adm1_pcode) VALUES (:adm2_pcode, :adm2_en, :adm1_pcode) ON CONFLICT (adm2_pcode) DO NOTHING"
    )
    for r in _load_csv("adm2_provinces.csv"):
        conn.execute(ins_provinces, {"adm2_pcode": r.get("adm2_pcode", ""), "adm2_en": r.get("adm2_en", ""), "adm1_pcode": r.get("adm1_pcode", "")})
    ins_municipalities = sa.text(
        "INSERT INTO address_municipalities (adm3_pcode, adm3_en, adm2_pcode) VALUES (:adm3_pcode, :adm3_en, :adm2_pcode) ON CONFLICT (adm3_pcode) DO NOTHING"
    )
    for r in _load_csv("adm3_municipalities.csv"):
        conn.execute(ins_municipalities, {"adm3_pcode": r.get("adm3_pcode", ""), "adm3_en": r.get("adm3_en", ""), "adm2_pcode": r.get("adm2_pcode", "")})
    ins_barangays = sa.text(
        "INSERT INTO address_barangays (adm4_pcode, adm4_en, adm3_pcode) VALUES (:adm4_pcode, :adm4_en, :adm3_pcode) ON CONFLICT (adm4_pcode) DO NOTHING"
    )
    for r in _load_csv("adm4_barangays.csv"):
        conn.execute(ins_barangays, {"adm4_pcode": r.get("adm4_pcode", ""), "adm4_en": r.get("adm4_en", ""), "adm3_pcode": r.get("adm3_pcode", "")})


def downgrade() -> None:
    op.get_bind().execute(sa.text("DELETE FROM address_barangays"))
    op.get_bind().execute(sa.text("DELETE FROM address_municipalities"))
    op.get_bind().execute(sa.text("DELETE FROM address_provinces"))
    op.get_bind().execute(sa.text("DELETE FROM address_regions"))
