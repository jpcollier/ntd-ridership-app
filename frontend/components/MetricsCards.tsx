import { MetricSummary } from '@/lib/api';

export function MetricsCards({ metrics }: { metrics: MetricSummary }) {
  return (
    <div className="grid cols-3">
      <section className="card">
        <div className="small">Unlinked passenger trips</div>
        <div className="metric">{Number(metrics.total_unlinked_passenger_trips).toLocaleString()}</div>
      </section>
      <section className="card">
        <div className="small">Vehicle revenue miles</div>
        <div className="metric">{metrics.total_vehicle_revenue_miles ? Number(metrics.total_vehicle_revenue_miles).toLocaleString() : '—'}</div>
      </section>
      <section className="card">
        <div className="small">Observation count</div>
        <div className="metric">{metrics.observation_count.toLocaleString()}</div>
      </section>
    </div>
  );
}
