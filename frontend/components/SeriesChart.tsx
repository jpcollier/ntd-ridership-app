import { SeriesPoint } from '@/lib/api';

export function SeriesChart({ points }: { points: SeriesPoint[] }) {
  const max = Math.max(...points.map((point) => Number(point.unlinked_passenger_trips)), 1);
  const latest = points.at(-1);

  return (
    <section className="card">
      <div className="small">Monthly ridership trend</div>
      <div className="chartHeader">
        <h2>Last 12 months of trip volume</h2>
        {latest ? <div className="small">Latest: {latest.period} • {Number(latest.unlinked_passenger_trips).toLocaleString()} trips</div> : null}
      </div>
      <div className="chart" aria-label="Ridership chart">
        {points.map((point) => {
          const height = Math.max((Number(point.unlinked_passenger_trips) / max) * 100, 10);
          return (
            <div className="barWrap" key={point.period}>
              <div className="bar" style={{ height: `${height}%` }} title={`${point.period}: ${point.unlinked_passenger_trips}`} />
              <span>{point.period.slice(5)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
