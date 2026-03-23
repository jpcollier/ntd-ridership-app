from app.schemas.common import ORMModel


class AgencyRead(ORMModel):
    id: int
    ntd_id: str
    name: str
    state: str | None = None
    url: str | None = None
