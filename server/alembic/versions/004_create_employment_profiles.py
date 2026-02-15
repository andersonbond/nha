"""create employment_profiles table

Revision ID: 004
Revises: 003
Create Date: 2026-02-05

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "004"
down_revision: Union[str, Sequence[str], None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "employment_profiles",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("beneficiary_id", sa.Integer(), nullable=True),
        sa.Column("education_code", sa.CHAR(1), nullable=True),
        sa.Column("employer", sa.String(20), nullable=True),
        sa.Column("position", sa.String(15), nullable=True),
        sa.Column("monthly_income", sa.Numeric(10, 2), nullable=True),
        sa.Column("monthly_expense", sa.Numeric(10, 2), nullable=True),
        sa.Column("no_household_members", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "employment_profiles_beneficiary_id_fkey",
        "employment_profiles",
        "beneficiaries",
        ["beneficiary_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "employment_profiles_beneficiary_id_fkey",
        "employment_profiles",
        type_="foreignkey",
    )
    op.drop_table("employment_profiles")
