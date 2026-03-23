from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import MetricSummary
from app.services.ridership import get_metrics

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("", response_model=MetricSummary)
def metrics(
    agency_id: int | None = Query(default=None),
    mode_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> MetricSummary:
    return get_metrics(db, agency_id=agency_id, mode_id=mode_id)
