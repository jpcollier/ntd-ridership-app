import { SeriesPoint } from '@/lib/api';

export function SeriesChart({ points }: { points: SeriesPoint[] }) {
  const max = Math.max(...points.map((point) => Number(point.unlinked_passenger_trips)), 1);
  return (
    <section className="card">
      <div className="small">Monthly ridership trend</div>
      <div className="chart" aria-label="Ridership chart">
        {points.map((point) => {
          const height = Math.max((Number(point.unlinked_passenger_trips) / max) * 100, 4);
          return <div className="bar" key={point.period} style={{ height: `${height}%` }} title={`${point.period}: ${point.unlinked_passenger_trips}`} />;
        })}
      </div>
    </section>
  );
}
