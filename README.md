# ntd-ridership-app

A monorepo scaffold for exploring National Transit Database ridership with a Next.js frontend, FastAPI backend, Postgres storage, and an idempotent CSV ingest pipeline.

## Repository layout

- `frontend/`: Next.js App Router MVP with explore, compare, and data table pages.
- `backend/`: FastAPI API, SQLAlchemy models, Alembic migration, and first-pass ingest service.
- `docker-compose.yml`: Local Postgres plus optional frontend/backend app containers.
- `scripts/dev.sh`: Convenience wrapper for local Docker development.

## Backend capabilities

- Versioned API under `/api/v1`.
- Health endpoint at `/api/v1/health`.
- Reference data endpoints for agencies and modes.
- Metrics, observations, chart series, and CSV download endpoints.
- Initial relational model for agencies, modes, monthly ridership facts, and ingest run metadata.
- CSV ingest pipeline with source hashing to support idempotent imports.

## Frontend MVP

- `/`: Explore dashboard with KPI cards, trend chart, and CSV download CTA.
- `/compare`: Compare page scaffold with agency/mode selectors.
- `/table`: Data table page for monthly observations.

## Local development

1. Copy `.env.example` values as needed.
2. Start the stack:

   ```bash
   ./scripts/dev.sh
   ```

3. Apply the database migration from the backend container or local Python environment:

   ```bash
   cd backend
   alembic upgrade head
   ```

4. Visit:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000/api/v1/health`

## Next steps

- Add seeded sample NTD data for a polished demo experience.
- Turn compare filters into client-side routed state.
- Add authentication, caching, and background ingest orchestration if the project grows.
