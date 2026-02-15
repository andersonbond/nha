"""create projects table

Revision ID: 006
Revises: 005
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "006"
down_revision: Union[str, Sequence[str], None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "projects",
        sa.Column("project_code", sa.String(20), primary_key=True),
        sa.Column("project_name", sa.String(60), nullable=True),
        sa.Column("program_class", sa.Numeric(5, 2), nullable=True),
        sa.Column("mother_tct", sa.String(13), nullable=True),
        sa.Column("sub_tct", sa.String(13), nullable=True),
        sa.Column("total_area", sa.Numeric(15, 2), nullable=True),
        sa.Column("project_cost", sa.Numeric(11, 2), nullable=True),
        sa.Column("lot_type", sa.CHAR(1), nullable=True),
        sa.Column("region_code", sa.String(4), nullable=True),
        sa.Column("province_code", sa.String(4), nullable=True),
        sa.Column("municipal_code", sa.String(4), nullable=True),
        sa.Column("barangay_code", sa.String(4), nullable=True),
        sa.Column("district_code", sa.String(1), nullable=True),
        sa.Column("office_code", sa.String(2), nullable=True),
        sa.Column("indicator", sa.CHAR(1), nullable=True),
        sa.Column("inp_date", sa.Date(), nullable=True),
        sa.Column("project_amo", sa.CHAR(1), nullable=True),
        sa.Column("original_po", sa.String(25), nullable=True),
        sa.Column("construction_pm", sa.String(25), nullable=True),
        sa.Column("depository_bank", sa.String(50), nullable=True),
        sa.Column("contract_type", sa.String(20), nullable=True),
        sa.Column("record_type", sa.String(20), nullable=True),
        sa.Column("amort_type", sa.String(10), nullable=True),
        sa.Column("project_prog_id", sa.Integer(), nullable=True),
        sa.Column("grace_period", sa.CHAR(1), nullable=True),
        sa.Column("account_type", sa.String(20), nullable=True),
        sa.Column("downpayment", sa.Numeric(11, 2), nullable=True),
        sa.Column("monthly_amortization", sa.Numeric(11, 2), nullable=True),
        sa.Column("interest_rate", sa.Numeric(7, 4), nullable=True),
        sa.Column("delinquency_rate", sa.Numeric(7, 4), nullable=True),
        sa.Column("selling_price", sa.Numeric(15, 2), nullable=True),
        sa.Column("terms_yr", sa.Integer(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("projects")
