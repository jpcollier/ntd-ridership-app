from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.agency import AgencyRead
from app.services.ridership import list_agencies

router = APIRouter(prefix="/agencies", tags=["agencies"])


@router.get("", response_model=list[AgencyRead])
def get_agencies(db: Session = Depends(get_db)) -> list[AgencyRead]:
    return [AgencyRead.model_validate(row) for row in list_agencies(db)]
