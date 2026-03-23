const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export type Agency = { id: number; ntd_id: string; name: string; state?: string | null };
export type Mode = { id: number; code: string; name: string };
export type MetricSummary = {
  total_unlinked_passenger_trips: string;
  total_vehicle_revenue_miles?: string | null;
  total_vehicle_revenue_hours?: string | null;
  observation_count: number;
};
export type Observation = {
  id: number;
  agency_id: number;
  mode_id: number;
  year: number;
  month: number;
  unlinked_passenger_trips: string;
};
export type SeriesPoint = {
  period: string;
  unlinked_passenger_trips: string;
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export const api = {
  agencies: () => getJson<Agency[]>('/agencies'),
  modes: () => getJson<Mode[]>('/modes'),
  metrics: (params = '') => getJson<MetricSummary>(`/metrics${params}`),
  observations: (params = '') => getJson<Observation[]>(`/observations${params}`),
  series: (params = '') => getJson<SeriesPoint[]>(`/observations/series${params}`),
  csvUrl: `${API_BASE}/observations/csv`,
};
