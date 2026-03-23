import { getDashboardDataset } from '@/lib/api';

export default async function TablePage() {
  const dataset = await getDashboardDataset();
  const agencyNames = new Map(dataset.agencies.map((agency) => [agency.id, agency.name]));
  const modeNames = new Map(dataset.modes.map((mode) => [mode.id, mode.name]));

  return (
    <section className="card pageStack">
      <div>
        <div className="small">Data table page</div>
        <h1>Monthly observations</h1>
        <p className="small smallBlock">A compact tabular review of the ridership feed for QA, analyst validation, and export-oriented workflows.</p>
      </div>
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>Agency</th>
              <th>Mode</th>
              <th>Period</th>
              <th>Trips</th>
              <th>Revenue miles</th>
              <th>Revenue hours</th>
            </tr>
          </thead>
          <tbody>
            {dataset.observations.map((observation) => (
              <tr key={observation.id}>
                <td>{agencyNames.get(observation.agency_id) ?? observation.agency_id}</td>
                <td>{modeNames.get(observation.mode_id) ?? observation.mode_id}</td>
                <td>{observation.year}-{String(observation.month).padStart(2, '0')}</td>
                <td>{Number(observation.unlinked_passenger_trips).toLocaleString()}</td>
                <td>{Number(observation.vehicle_revenue_miles ?? 0).toLocaleString()}</td>
                <td>{Number(observation.vehicle_revenue_hours ?? 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
