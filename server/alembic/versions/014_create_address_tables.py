"""create address_regions, address_provinces, address_municipalities, address_barangays

Revision ID: 014
Revises: 013
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "014"
down_revision: Union[str, Sequence[str], None] = "013"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "address_regions",
        sa.Column("adm1_pcode", sa.String(8), primary_key=True),
        sa.Column("adm1_en", sa.String(255), nullable=False),
        sa.Column("adm0_pcode", sa.String(4), nullable=True),
    )
    op.create_table(
        "address_provinces",
        sa.Column("adm2_pcode", sa.String(12), primary_key=True),
        sa.Column("adm2_en", sa.String(255), nullable=False),
        sa.Column("adm1_pcode", sa.String(8), sa.ForeignKey("address_regions.adm1_pcode"), nullable=False),
    )
    op.create_index("ix_address_provinces_adm1_pcode", "address_provinces", ["adm1_pcode"], unique=False)
    op.create_table(
        "address_municipalities",
        sa.Column("adm3_pcode", sa.String(14), primary_key=True),
        sa.Column("adm3_en", sa.String(255), nullable=False),
        sa.Column("adm2_pcode", sa.String(12), sa.ForeignKey("address_provinces.adm2_pcode"), nullable=False),
    )
    op.create_index("ix_address_municipalities_adm2_pcode", "address_municipalities", ["adm2_pcode"], unique=False)
    op.create_table(
        "address_barangays",
        sa.Column("adm4_pcode", sa.String(16), primary_key=True),
        sa.Column("adm4_en", sa.String(255), nullable=False),
        sa.Column("adm3_pcode", sa.String(14), sa.ForeignKey("address_municipalities.adm3_pcode"), nullable=False),
    )
    op.create_index("ix_address_barangays_adm3_pcode", "address_barangays", ["adm3_pcode"], unique=False)


def downgrade() -> None:
    op.drop_table("address_barangays")
    op.drop_table("address_municipalities")
    op.drop_table("address_provinces")
    op.drop_table("address_regions")
