"""initial schema"""

from alembic import op
import sqlalchemy as sa

revision = "20260323_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "agencies",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("ntd_id", sa.String(length=32), nullable=False, unique=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("state", sa.String(length=32), nullable=True),
        sa.Column("url", sa.String(length=255), nullable=True),
    )
    op.create_table(
        "modes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("code", sa.String(length=16), nullable=False, unique=True),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
    )
    op.create_table(
        "ingest_runs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source_name", sa.String(length=255), nullable=False),
        sa.Column("source_hash", sa.String(length=128), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("record_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("source_name", "source_hash", name="uq_ingest_source_hash"),
    )
    op.create_table(
        "monthly_ridership",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("agency_id", sa.Integer(), sa.ForeignKey("agencies.id"), nullable=False),
        sa.Column("mode_id", sa.Integer(), sa.ForeignKey("modes.id"), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("month", sa.Integer(), nullable=False),
        sa.Column("unlinked_passenger_trips", sa.Numeric(14, 2), nullable=False),
        sa.Column("vehicle_revenue_miles", sa.Numeric(14, 2), nullable=True),
        sa.Column("vehicle_revenue_hours", sa.Numeric(14, 2), nullable=True),
        sa.Column("ingest_run_id", sa.Integer(), sa.ForeignKey("ingest_runs.id"), nullable=True),
        sa.UniqueConstraint("agency_id", "mode_id", "year", "month", name="uq_monthly_fact_period"),
    )


def downgrade() -> None:
    op.drop_table("monthly_ridership")
    op.drop_table("ingest_runs")
    op.drop_table("modes")
    op.drop_table("agencies")
