import { getDashboardDataset } from '@/lib/api';

export default async function ComparePage() {
  const dataset = await getDashboardDataset();
  const topAgencies = dataset.agencies
    .map((agency) => {
      const trips = dataset.observations
        .filter((observation) => observation.agency_id === agency.id)
        .reduce((sum, observation) => sum + Number(observation.unlinked_passenger_trips), 0);

      return {
        ...agency,
        trips,
      };
    })
    .sort((a, b) => b.trips - a.trips)
    .slice(0, 3);

  const modeBreakdown = dataset.modes.map((mode) => ({
    ...mode,
    trips: dataset.observations
      .filter((observation) => observation.mode_id === mode.id)
      .reduce((sum, observation) => sum + Number(observation.unlinked_passenger_trips), 0),
  }));

  return (
    <div className="grid pageStack">
      <section className="card">
        <div className="small">Compare page</div>
        <h1>Compare agencies and modes</h1>
        <p className="lede smallBlock">
          This view turns the current dataset into quick benchmark cards so a stakeholder can immediately see who carries the most riders and which modes dominate the network.
        </p>
        <div className="filterRow">
          <select className="select" defaultValue="">
            <option value="">Select agency</option>
            {dataset.agencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}
          </select>
          <select className="select" defaultValue="">
            <option value="">Select mode</option>
            {dataset.modes.map((mode) => <option key={mode.id} value={mode.id}>{mode.name}</option>)}
          </select>
        </div>
      </section>

      <section className="grid cols-2 responsiveSplit">
        <section className="card">
          <div className="small">Top agencies</div>
          <div className="stackList">
            {topAgencies.map((agency, index) => (
              <div className="listRow" key={agency.id}>
                <div>
                  <div className="rankBadge">#{index + 1}</div>
                  <strong>{agency.name}</strong>
                  <div className="small">{agency.state ?? 'Multi-state'} • {agency.ntd_id}</div>
                </div>
                <div className="metricInline">{agency.trips.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="small">Mode breakdown</div>
          <div className="stackList">
            {modeBreakdown.map((mode) => (
              <div className="listRow" key={mode.id}>
                <div>
                  <strong>{mode.name}</strong>
                  <div className="small">Code {mode.code}</div>
                </div>
                <div className="metricInline">{mode.trips.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
