from fastapi import APIRouter

from app.api.routes.agencies import router as agencies_router
from app.api.routes.health import router as health_router
from app.api.routes.metrics import router as metrics_router
from app.api.routes.modes import router as modes_router
from app.api.routes.observations import router as observations_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(agencies_router)
api_router.include_router(modes_router)
api_router.include_router(metrics_router)
api_router.include_router(observations_router)
