"""create user_accounts, user_roles, and user_account_roles tables for UAM

Revision ID: 018
Revises: 017
Create Date: 2026-02-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "018"
down_revision: Union[str, Sequence[str], None] = "017"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_roles",
        sa.Column("id", sa.SmallInteger(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(64), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
    )
    op.create_index("ix_user_roles_name", "user_roles", ["name"], unique=True)

    op.create_table(
        "user_accounts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("sso_identifier", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("display_name", sa.String(255), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
    )
    op.create_index("ix_user_accounts_sso_identifier", "user_accounts", ["sso_identifier"], unique=True)

    op.create_table(
        "user_account_roles",
        sa.Column("user_account_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("role_id", sa.SmallInteger(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.PrimaryKeyConstraint("user_account_id", "role_id"),
        sa.ForeignKeyConstraint(["user_account_id"], ["user_accounts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["role_id"], ["user_roles.id"], ondelete="CASCADE"),
    )


def downgrade() -> None:
    op.drop_table("user_account_roles")
    op.drop_index("ix_user_accounts_sso_identifier", table_name="user_accounts")
    op.drop_table("user_accounts")
    op.drop_index("ix_user_roles_name", table_name="user_roles")
    op.drop_table("user_roles")
