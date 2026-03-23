import { api } from '@/lib/api';

export default async function ComparePage() {
  const [agencies, modes] = await Promise.all([api.agencies(), api.modes()]);

  return (
    <div className="grid">
      <section className="card">
        <div className="small">Compare page</div>
        <h1>Compare agencies and modes</h1>
        <div className="filterRow">
          <select className="select" defaultValue="">
            <option value="">Select agency</option>
            {agencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}
          </select>
          <select className="select" defaultValue="">
            <option value="">Select mode</option>
            {modes.map((mode) => <option key={mode.id} value={mode.id}>{mode.name}</option>)}
          </select>
        </div>
        <p className="small">This scaffold wires the compare surface to live backend reference data and leaves room for interactive client filters.</p>
      </section>
    </div>
  );
}
