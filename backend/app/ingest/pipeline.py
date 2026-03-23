import csv
import hashlib
from datetime import datetime, UTC
from decimal import Decimal
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.agency import Agency
from app.models.ingest_run import IngestRun
from app.models.mode import Mode
from app.models.monthly_ridership import MonthlyRidership


EXPECTED_COLUMNS = {
    "ntd_id",
    "agency_name",
    "state",
    "mode_code",
    "mode_name",
    "year",
    "month",
    "unlinked_passenger_trips",
    "vehicle_revenue_miles",
    "vehicle_revenue_hours",
}


def ingest_csv(db: Session, file_path: str) -> IngestRun:
    raw_bytes = Path(file_path).read_bytes()
    source_hash = hashlib.sha256(raw_bytes).hexdigest()
    existing = db.scalar(
        select(IngestRun).where(IngestRun.source_name == Path(file_path).name, IngestRun.source_hash == source_hash)
    )
    if existing:
        return existing

    run = IngestRun(source_name=Path(file_path).name, source_hash=source_hash, status="running")
    db.add(run)
    db.flush()

    rows = list(csv.DictReader(raw_bytes.decode("utf-8-sig").splitlines()))
    missing = EXPECTED_COLUMNS - set(rows[0].keys()) if rows else set()
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")

    loaded = 0
    for row in rows:
        agency = db.scalar(select(Agency).where(Agency.ntd_id == row["ntd_id"].strip()))
        if agency is None:
            agency = Agency(
                ntd_id=row["ntd_id"].strip(),
                name=row["agency_name"].strip(),
                state=row["state"].strip() or None,
            )
            db.add(agency)
            db.flush()

        mode = db.scalar(select(Mode).where(Mode.code == row["mode_code"].strip()))
        if mode is None:
            mode = Mode(code=row["mode_code"].strip(), name=row["mode_name"].strip())
            db.add(mode)
            db.flush()

        fact = db.scalar(
            select(MonthlyRidership).where(
                MonthlyRidership.agency_id == agency.id,
                MonthlyRidership.mode_id == mode.id,
                MonthlyRidership.year == int(row["year"]),
                MonthlyRidership.month == int(row["month"]),
            )
        )
        if fact is None:
            fact = MonthlyRidership(
                agency_id=agency.id,
                mode_id=mode.id,
                year=int(row["year"]),
                month=int(row["month"]),
                unlinked_passenger_trips=Decimal(row["unlinked_passenger_trips"]),
                vehicle_revenue_miles=Decimal(row["vehicle_revenue_miles"]) if row["vehicle_revenue_miles"] else None,
                vehicle_revenue_hours=Decimal(row["vehicle_revenue_hours"]) if row["vehicle_revenue_hours"] else None,
                ingest_run_id=run.id,
            )
            db.add(fact)
        else:
            fact.unlinked_passenger_trips = Decimal(row["unlinked_passenger_trips"])
            fact.vehicle_revenue_miles = Decimal(row["vehicle_revenue_miles"]) if row["vehicle_revenue_miles"] else None
            fact.vehicle_revenue_hours = Decimal(row["vehicle_revenue_hours"]) if row["vehicle_revenue_hours"] else None
            fact.ingest_run_id = run.id
        loaded += 1

    run.status = "completed"
    run.record_count = loaded
    run.completed_at = datetime.now(UTC)
    db.commit()
    db.refresh(run)
    return run
