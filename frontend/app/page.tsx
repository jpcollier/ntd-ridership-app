import { MetricsCards } from '@/components/MetricsCards';
import { SeriesChart } from '@/components/SeriesChart';
import { api } from '@/lib/api';

export default async function HomePage() {
  const [metrics, series] = await Promise.all([api.metrics(), api.series()]);

  return (
    <div className="grid">
      <section className="card hero">
        <div>
          <div className="small">Explore dashboard</div>
          <h1>National Transit Database ridership explorer</h1>
          <p className="small">Start with a chart-ready API, CSV export, and extensible monorepo foundation.</p>
        </div>
        <a className="button" href={api.csvUrl}>Download CSV</a>
      </section>
      <MetricsCards metrics={metrics} />
      <SeriesChart points={series.slice(-12)} />
    </div>
  );
}
