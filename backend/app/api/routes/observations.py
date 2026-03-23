from fastapi import APIRouter, Depends, Query
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.observation import ObservationRead, SeriesPoint
from app.services.ridership import get_series, list_observations, observations_to_csv

router = APIRouter(prefix="/observations", tags=["observations"])


@router.get("", response_model=list[ObservationRead])
def observations(
    agency_id: int | None = Query(default=None),
    mode_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[ObservationRead]:
    return [ObservationRead.model_validate(row) for row in list_observations(db, agency_id=agency_id, mode_id=mode_id)]


@router.get("/series", response_model=list[SeriesPoint])
def series(
    agency_id: int | None = Query(default=None),
    mode_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[SeriesPoint]:
    return get_series(db, agency_id=agency_id, mode_id=mode_id)


@router.get("/csv", response_class=PlainTextResponse)
def observations_csv(
    agency_id: int | None = Query(default=None),
    mode_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> PlainTextResponse:
    csv_text = observations_to_csv(list_observations(db, agency_id=agency_id, mode_id=mode_id))
    return PlainTextResponse(
        content=csv_text,
        headers={"Content-Disposition": "attachment; filename=observations.csv"},
        media_type="text/csv",
    )
