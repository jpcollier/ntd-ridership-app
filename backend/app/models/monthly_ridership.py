from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class MonthlyRidership(Base):
    __tablename__ = "monthly_ridership"
    __table_args__ = (UniqueConstraint("agency_id", "mode_id", "year", "month", name="uq_monthly_fact_period"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    agency_id: Mapped[int] = mapped_column(ForeignKey("agencies.id"), index=True)
    mode_id: Mapped[int] = mapped_column(ForeignKey("modes.id"), index=True)
    year: Mapped[int] = mapped_column(Integer, index=True)
    month: Mapped[int] = mapped_column(Integer, index=True)
    unlinked_passenger_trips: Mapped[Decimal] = mapped_column(Numeric(14, 2))
    vehicle_revenue_miles: Mapped[Decimal | None] = mapped_column(Numeric(14, 2), nullable=True)
    vehicle_revenue_hours: Mapped[Decimal | None] = mapped_column(Numeric(14, 2), nullable=True)
    ingest_run_id: Mapped[int | None] = mapped_column(ForeignKey("ingest_runs.id"), nullable=True)

    agency = relationship("Agency", back_populates="observations")
    mode = relationship("Mode", back_populates="observations")
    ingest_run = relationship("IngestRun", back_populates="observations")
