import { MetricSummary } from '@/lib/api';

const metricCards = [
  { key: 'total_unlinked_passenger_trips', label: 'Unlinked passenger trips' },
  { key: 'total_vehicle_revenue_miles', label: 'Vehicle revenue miles' },
  { key: 'total_vehicle_revenue_hours', label: 'Vehicle revenue hours' },
  { key: 'observation_count', label: 'Observation count' },
] as const;

export function MetricsCards({ metrics }: { metrics: MetricSummary }) {
  return (
    <div className="grid cols-4">
      {metricCards.map((card) => {
        const value = metrics[card.key];
        const displayValue = typeof value === 'number'
          ? value.toLocaleString()
          : value
            ? Number(value).toLocaleString()
            : '—';

        return (
          <section className="card metricCard" key={card.key}>
            <div className="small">{card.label}</div>
            <div className="metric">{displayValue}</div>
          </section>
        );
      })}
    </div>
  );
}
