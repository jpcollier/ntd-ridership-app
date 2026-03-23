from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class MetricSummary(BaseModel):
    total_unlinked_passenger_trips: Decimal
    total_vehicle_revenue_miles: Decimal | None
    total_vehicle_revenue_hours: Decimal | None
    observation_count: int
