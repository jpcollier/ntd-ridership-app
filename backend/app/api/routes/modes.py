from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.mode import ModeRead
from app.services.ridership import list_modes

router = APIRouter(prefix="/modes", tags=["modes"])


@router.get("", response_model=list[ModeRead])
def get_modes(db: Session = Depends(get_db)) -> list[ModeRead]:
    return [ModeRead.model_validate(row) for row in list_modes(db)]
