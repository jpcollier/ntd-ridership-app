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
  vehicle_revenue_miles?: string | null;
  vehicle_revenue_hours?: string | null;
};
export type SeriesPoint = {
  period: string;
  unlinked_passenger_trips: string;
  vehicle_revenue_miles?: string | null;
  vehicle_revenue_hours?: string | null;
};

export type DashboardDataset = {
  agencies: Agency[];
  modes: Mode[];
  metrics: MetricSummary;
  observations: Observation[];
  series: SeriesPoint[];
  sourceLabel: string;
  usingMockData: boolean;
};

const mockAgencies: Agency[] = [
  { id: 1, ntd_id: 'MTA-NYC', name: 'MTA New York City Transit', state: 'NY' },
  { id: 2, ntd_id: 'CTA-CHI', name: 'Chicago Transit Authority', state: 'IL' },
  { id: 3, ntd_id: 'LA-MET', name: 'LA Metro', state: 'CA' },
];

const mockModes: Mode[] = [
  { id: 1, code: 'HR', name: 'Heavy Rail' },
  { id: 2, code: 'MB', name: 'Motorbus' },
  { id: 3, code: 'LR', name: 'Light Rail' },
];

const mockObservations: Observation[] = [
  { id: 1, agency_id: 1, mode_id: 1, year: 2025, month: 1, unlinked_passenger_trips: '142000000', vehicle_revenue_miles: '48300000', vehicle_revenue_hours: '4020000' },
  { id: 2, agency_id: 1, mode_id: 1, year: 2025, month: 2, unlinked_passenger_trips: '145500000', vehicle_revenue_miles: '48900000', vehicle_revenue_hours: '4075000' },
  { id: 3, agency_id: 1, mode_id: 1, year: 2025, month: 3, unlinked_passenger_trips: '149800000', vehicle_revenue_miles: '49500000', vehicle_revenue_hours: '4110000' },
  { id: 4, agency_id: 2, mode_id: 2, year: 2025, month: 1, unlinked_passenger_trips: '26800000', vehicle_revenue_miles: '14100000', vehicle_revenue_hours: '1520000' },
  { id: 5, agency_id: 2, mode_id: 2, year: 2025, month: 2, unlinked_passenger_trips: '27100000', vehicle_revenue_miles: '14350000', vehicle_revenue_hours: '1540000' },
  { id: 6, agency_id: 2, mode_id: 2, year: 2025, month: 3, unlinked_passenger_trips: '27900000', vehicle_revenue_miles: '14600000', vehicle_revenue_hours: '1565000' },
  { id: 7, agency_id: 3, mode_id: 3, year: 2025, month: 1, unlinked_passenger_trips: '9100000', vehicle_revenue_miles: '6200000', vehicle_revenue_hours: '780000' },
  { id: 8, agency_id: 3, mode_id: 3, year: 2025, month: 2, unlinked_passenger_trips: '9400000', vehicle_revenue_miles: '6350000', vehicle_revenue_hours: '792000' },
  { id: 9, agency_id: 3, mode_id: 3, year: 2025, month: 3, unlinked_passenger_trips: '9850000', vehicle_revenue_miles: '6480000', vehicle_revenue_hours: '805000' },
  { id: 10, agency_id: 1, mode_id: 2, year: 2025, month: 3, unlinked_passenger_trips: '51800000', vehicle_revenue_miles: '21600000', vehicle_revenue_hours: '2670000' },
  { id: 11, agency_id: 3, mode_id: 2, year: 2025, month: 3, unlinked_passenger_trips: '12400000', vehicle_revenue_miles: '7700000', vehicle_revenue_hours: '910000' },
  { id: 12, agency_id: 2, mode_id: 1, year: 2025, month: 3, unlinked_passenger_trips: '5400000', vehicle_revenue_miles: '1920000', vehicle_revenue_hours: '294000' },
];

const mockSeries: SeriesPoint[] = [
  { period: '2024-04', unlinked_passenger_trips: '176000000', vehicle_revenue_miles: '65200000', vehicle_revenue_hours: '6200000' },
  { period: '2024-05', unlinked_passenger_trips: '181000000', vehicle_revenue_miles: '66100000', vehicle_revenue_hours: '6280000' },
  { period: '2024-06', unlinked_passenger_trips: '185000000', vehicle_revenue_miles: '66900000', vehicle_revenue_hours: '6350000' },
  { period: '2024-07', unlinked_passenger_trips: '188000000', vehicle_revenue_miles: '67400000', vehicle_revenue_hours: '6410000' },
  { period: '2024-08', unlinked_passenger_trips: '191000000', vehicle_revenue_miles: '68100000', vehicle_revenue_hours: '6480000' },
  { period: '2024-09', unlinked_passenger_trips: '187000000', vehicle_revenue_miles: '67500000', vehicle_revenue_hours: '6440000' },
  { period: '2024-10', unlinked_passenger_trips: '193000000', vehicle_revenue_miles: '68900000', vehicle_revenue_hours: '6520000' },
  { period: '2024-11', unlinked_passenger_trips: '196000000', vehicle_revenue_miles: '69400000', vehicle_revenue_hours: '6570000' },
  { period: '2024-12', unlinked_passenger_trips: '201000000', vehicle_revenue_miles: '70300000', vehicle_revenue_hours: '6650000' },
  { period: '2025-01', unlinked_passenger_trips: '194000000', vehicle_revenue_miles: '69000000', vehicle_revenue_hours: '6540000' },
  { period: '2025-02', unlinked_passenger_trips: '199000000', vehicle_revenue_miles: '70000000', vehicle_revenue_hours: '6610000' },
  { period: '2025-03', unlinked_passenger_trips: '207000000', vehicle_revenue_miles: '71800000', vehicle_revenue_hours: '6760000' },
];

function aggregateMetrics(observations: Observation[]): MetricSummary {
  const totals = observations.reduce(
    (acc, item) => {
      acc.trips += Number(item.unlinked_passenger_trips);
      acc.miles += Number(item.vehicle_revenue_miles ?? 0);
      acc.hours += Number(item.vehicle_revenue_hours ?? 0);
      return acc;
    },
    { trips: 0, miles: 0, hours: 0 },
  );

  return {
    total_unlinked_passenger_trips: String(totals.trips),
    total_vehicle_revenue_miles: String(totals.miles),
    total_vehicle_revenue_hours: String(totals.hours),
    observation_count: observations.length,
  };
}

const mockDataset: DashboardDataset = {
  agencies: mockAgencies,
  modes: mockModes,
  metrics: aggregateMetrics(mockObservations),
  observations: mockObservations,
  series: mockSeries,
  sourceLabel: 'Demo dataset',
  usingMockData: true,
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

async function getJsonOrFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    return await getJson<T>(path);
  } catch {
    return fallback;
  }
}

export async function getDashboardDataset(): Promise<DashboardDataset> {
  try {
    const [agencies, modes, metrics, observations, series] = await Promise.all([
      getJson<Agency[]>('/agencies'),
      getJson<Mode[]>('/modes'),
      getJson<MetricSummary>('/metrics'),
      getJson<Observation[]>('/observations'),
      getJson<SeriesPoint[]>('/observations/series'),
    ]);

    return {
      agencies,
      modes,
      metrics,
      observations,
      series,
      sourceLabel: 'Live API',
      usingMockData: false,
    };
  } catch {
    return mockDataset;
  }
}

export const api = {
  agencies: () => getJsonOrFallback<Agency[]>('/agencies', mockDataset.agencies),
  modes: () => getJsonOrFallback<Mode[]>('/modes', mockDataset.modes),
  metrics: (params = '') => getJsonOrFallback<MetricSummary>(`/metrics${params}`, mockDataset.metrics),
  observations: (params = '') => getJsonOrFallback<Observation[]>(`/observations${params}`, mockDataset.observations),
  series: (params = '') => getJsonOrFallback<SeriesPoint[]>(`/observations/series${params}`, mockDataset.series),
  csvUrl: `${API_BASE}/observations/csv`,
};
