"""add address columns to applications and beneficiaries

Revision ID: 016
Revises: 015
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "016"
down_revision: Union[str, Sequence[str], None] = "015"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("applications", sa.Column("region_code", sa.String(8), nullable=True))
    op.add_column("applications", sa.Column("province_code", sa.String(12), nullable=True))
    op.add_column("applications", sa.Column("municipal_code", sa.String(14), nullable=True))
    op.add_column("applications", sa.Column("barangay_code", sa.String(16), nullable=True))
    op.add_column("applications", sa.Column("district_code", sa.String(2), nullable=True))
    op.add_column("beneficiaries", sa.Column("region_code", sa.String(8), nullable=True))
    op.add_column("beneficiaries", sa.Column("province_code", sa.String(12), nullable=True))
    op.add_column("beneficiaries", sa.Column("municipal_code", sa.String(14), nullable=True))
    op.add_column("beneficiaries", sa.Column("barangay_code", sa.String(16), nullable=True))
    op.add_column("beneficiaries", sa.Column("district_code", sa.String(2), nullable=True))


def downgrade() -> None:
    op.drop_column("applications", "district_code")
    op.drop_column("applications", "barangay_code")
    op.drop_column("applications", "municipal_code")
    op.drop_column("applications", "province_code")
    op.drop_column("applications", "region_code")
    op.drop_column("beneficiaries", "district_code")
    op.drop_column("beneficiaries", "barangay_code")
    op.drop_column("beneficiaries", "municipal_code")
    op.drop_column("beneficiaries", "province_code")
    op.drop_column("beneficiaries", "region_code")
