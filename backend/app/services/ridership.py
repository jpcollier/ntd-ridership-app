import csv
import io
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.agency import Agency
from app.models.mode import Mode
from app.models.monthly_ridership import MonthlyRidership
from app.schemas.common import MetricSummary
from app.schemas.observation import SeriesPoint


def list_agencies(db: Session) -> list[Agency]:
    return list(db.scalars(select(Agency).order_by(Agency.name)))


def list_modes(db: Session) -> list[Mode]:
    return list(db.scalars(select(Mode).order_by(Mode.name)))


def list_observations(db: Session, agency_id: int | None = None, mode_id: int | None = None) -> list[MonthlyRidership]:
    stmt = select(MonthlyRidership).order_by(MonthlyRidership.year.desc(), MonthlyRidership.month.desc())
    if agency_id is not None:
        stmt = stmt.where(MonthlyRidership.agency_id == agency_id)
    if mode_id is not None:
        stmt = stmt.where(MonthlyRidership.mode_id == mode_id)
    return list(db.scalars(stmt))


def get_metrics(db: Session, agency_id: int | None = None, mode_id: int | None = None) -> MetricSummary:
    stmt = select(
        func.coalesce(func.sum(MonthlyRidership.unlinked_passenger_trips), 0),
        func.sum(MonthlyRidership.vehicle_revenue_miles),
        func.sum(MonthlyRidership.vehicle_revenue_hours),
        func.count(MonthlyRidership.id),
    )
    if agency_id is not None:
        stmt = stmt.where(MonthlyRidership.agency_id == agency_id)
    if mode_id is not None:
        stmt = stmt.where(MonthlyRidership.mode_id == mode_id)
    total_trips, total_miles, total_hours, observation_count = db.execute(stmt).one()
    return MetricSummary(
        total_unlinked_passenger_trips=Decimal(total_trips),
        total_vehicle_revenue_miles=Decimal(total_miles) if total_miles is not None else None,
        total_vehicle_revenue_hours=Decimal(total_hours) if total_hours is not None else None,
        observation_count=observation_count,
    )


def get_series(db: Session, agency_id: int | None = None, mode_id: int | None = None) -> list[SeriesPoint]:
    stmt = select(MonthlyRidership).order_by(MonthlyRidership.year, MonthlyRidership.month)
    if agency_id is not None:
        stmt = stmt.where(MonthlyRidership.agency_id == agency_id)
    if mode_id is not None:
        stmt = stmt.where(MonthlyRidership.mode_id == mode_id)
    return [
        SeriesPoint(
            period=f"{row.year:04d}-{row.month:02d}",
            unlinked_passenger_trips=row.unlinked_passenger_trips,
            vehicle_revenue_miles=row.vehicle_revenue_miles,
            vehicle_revenue_hours=row.vehicle_revenue_hours,
        )
        for row in db.scalars(stmt)
    ]


def observations_to_csv(rows: list[MonthlyRidership]) -> str:
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow([
        "agency_id",
        "mode_id",
        "year",
        "month",
        "unlinked_passenger_trips",
        "vehicle_revenue_miles",
        "vehicle_revenue_hours",
    ])
    for row in rows:
        writer.writerow([
            row.agency_id,
            row.mode_id,
            row.year,
            row.month,
            row.unlinked_passenger_trips,
            row.vehicle_revenue_miles,
            row.vehicle_revenue_hours,
        ])
    return buffer.getvalue()
