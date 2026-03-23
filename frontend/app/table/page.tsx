import { api } from '@/lib/api';

export default async function TablePage() {
  const observations = await api.observations();

  return (
    <section className="card">
      <div className="small">Data table page</div>
      <h1>Monthly observations</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Agency</th>
            <th>Mode</th>
            <th>Period</th>
            <th>Trips</th>
          </tr>
        </thead>
        <tbody>
          {observations.map((observation) => (
            <tr key={observation.id}>
              <td>{observation.agency_id}</td>
              <td>{observation.mode_id}</td>
              <td>{observation.year}-{String(observation.month).padStart(2, '0')}</td>
              <td>{Number(observation.unlinked_passenger_trips).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
