import Link from 'next/link';

import { MetricsCards } from '@/components/MetricsCards';
import { SeriesChart } from '@/components/SeriesChart';
import { api, getDashboardDataset } from '@/lib/api';

const features = [
  'Executive KPI summary for trips, service miles, and tracked observations.',
  'Monthly trend chart that works with either the live API or demo fallback data.',
  'Dedicated compare and table views for agency-level exploration.',
];

export default async function HomePage() {
  const dataset = await getDashboardDataset();
  const latestPeriod = dataset.series.at(-1)?.period ?? 'N/A';
  const agencyCount = dataset.agencies.length;
  const modeCount = dataset.modes.length;

  return (
    <div className="grid pageStack">
      <section className="card hero heroGrid">
        <div className="heroCopy">
          <div className="eyebrow">Transit ridership MVP</div>
          <h1>National Transit Database ridership, shaped into a decision-ready dashboard.</h1>
          <p className="lede">
            Explore monthly ridership patterns, compare agencies and service modes, and move from CSV-style raw data to a shareable planning snapshot.
          </p>
          <div className="heroActions">
            <Link className="button" href="/compare">Open compare view</Link>
            <Link className="button buttonSecondary" href="/table">Browse observations</Link>
          </div>
        </div>
        <div className="heroPanel">
          <div className="panelLabel">Dataset status</div>
          <div className="statusPill">{dataset.sourceLabel}</div>
          <ul className="detailList">
            <li><strong>{agencyCount}</strong> agencies in the current view.</li>
            <li><strong>{modeCount}</strong> transit modes available for slicing.</li>
            <li><strong>{latestPeriod}</strong> is the latest monthly trend point.</li>
          </ul>
          <a className="button buttonGhost" href={dataset.usingMockData ? '#' : api.csvUrl}>
            {dataset.usingMockData ? 'CSV available with live API' : 'Download live CSV'}
          </a>
        </div>
      </section>

      <MetricsCards metrics={dataset.metrics} />

      <section className="grid cols-2 responsiveSplit">
        <SeriesChart points={dataset.series.slice(-12)} />
        <section className="card">
          <div className="small">Why this MVP is screenshot-ready</div>
          <h2>Clear story, visible data, and enough depth to demo.</h2>
          <div className="featureList">
            {features.map((feature) => (
              <div className="featureItem" key={feature}>{feature}</div>
            ))}
          </div>
          <p className="small">
            {dataset.usingMockData
              ? 'The app is currently rendering the built-in demo dataset so the UI remains polished even before the backend is populated.'
              : 'The app is connected to live backend data and ready for richer slicing and exports.'}
          </p>
        </section>
      </section>
    </div>
  );
}
