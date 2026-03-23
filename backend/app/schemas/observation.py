from decimal import Decimal

from app.schemas.common import ORMModel


class ObservationRead(ORMModel):
    id: int
    agency_id: int
    mode_id: int
    year: int
    month: int
    unlinked_passenger_trips: Decimal
    vehicle_revenue_miles: Decimal | None = None
    vehicle_revenue_hours: Decimal | None = None


class SeriesPoint(ORMModel):
    period: str
    unlinked_passenger_trips: Decimal
    vehicle_revenue_miles: Decimal | None = None
    vehicle_revenue_hours: Decimal | None = None
