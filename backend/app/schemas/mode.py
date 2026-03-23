from app.schemas.common import ORMModel


class ModeRead(ORMModel):
    id: int
    code: str
    name: str
    description: str | None = None
