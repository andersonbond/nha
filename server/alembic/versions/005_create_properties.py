"""create properties table

Revision ID: 005
Revises: 004
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "005"
down_revision: Union[str, Sequence[str], None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "properties",
        sa.Column("geoid", sa.String(20), primary_key=True),
        sa.Column("source_geoid", sa.String(20), nullable=True),
        sa.Column("common_code", sa.String(20), nullable=True),
        sa.Column("old_common_code", sa.String(20), nullable=True),
        sa.Column("project_code", sa.String(20), nullable=True),
        sa.Column("sb_phase", sa.String(20), nullable=True),
        sa.Column("sb_survey", sa.String(20), nullable=True),
        sa.Column("sb_block", sa.String(20), nullable=True),
        sa.Column("sb_lot", sa.String(20), nullable=True),
        sa.Column("disposition_status", sa.CHAR(1), nullable=True),
        sa.Column("property_type", sa.String(3), nullable=True),
        sa.Column("lhc", sa.CHAR(1), nullable=True),
        sa.Column("development_status", sa.CHAR(1), nullable=True),
        sa.Column("area_sqm", sa.Numeric(15, 2), nullable=True),
        sa.Column("tct_no", sa.String(20), nullable=True),
        sa.Column("tct_date", sa.Date(), nullable=True),
        sa.Column("price_sqm", sa.Numeric(8, 2), nullable=True),
        sa.Column("program_class", sa.Numeric(5, 2), nullable=True),
        sa.Column("mode_disposition", sa.CHAR(1), nullable=True),
        sa.Column("disposition_date", sa.Date(), nullable=True),
        sa.Column("disposition_target", sa.CHAR(1), nullable=True),
        sa.Column("transaction_type", sa.CHAR(1), nullable=True),
        sa.Column("transaction_date", sa.Date(), nullable=True),
        sa.Column("sales_report_no", sa.String(21), nullable=True),
        sa.Column("sales_report_date", sa.Date(), nullable=True),
        sa.Column("effectivity_date", sa.Date(), nullable=True),
        sa.Column("production_date", sa.Date(), nullable=True),
        sa.Column("old_area", sa.Numeric(15, 2), nullable=True),
        sa.Column("emd_tag", sa.CHAR(1), nullable=True),
        sa.Column("principal_amount", sa.Numeric(14, 2), nullable=True),
        sa.Column("house_interest_rate", sa.Numeric(5, 2), nullable=True),
        sa.Column("house_area_sqm", sa.Numeric(10, 2), nullable=True),
        sa.Column("house_price", sa.Numeric(10, 2), nullable=True),
        sa.Column("house_model", sa.String(10), nullable=True),
        sa.Column("house_downpayment", sa.Numeric(10, 2), nullable=True),
        sa.Column("house_terms", sa.Numeric(5, 2), nullable=True),
        sa.Column("house_amortization", sa.Numeric(10, 2), nullable=True),
        sa.Column("house_input_date", sa.Date(), nullable=True),
        sa.Column("fvac_occ", sa.String(3), nullable=True),
        sa.Column("indicator", sa.CHAR(1), nullable=True),
        sa.Column("inp_date", sa.Date(), nullable=True),
        sa.Column("ntag", sa.String(3), nullable=True),
        sa.Column("active_stat", sa.String(3), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("properties")
