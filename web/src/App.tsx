import { useReport } from './api';
import { toChartData } from './chartData';
import ReportChart from './chart';

export function App() {
  const { data, error, isLoading } = useReport();
  const chartData = toChartData(data);

  return (
    <main>
      <h1>Brand visibility</h1>
      <p>Ray-Ban vs Oakley, Warby Parker, Persol</p>

      {isLoading && <p>Loading…</p>}
      {error && <p role="alert">Could not load report: {error.message}</p>}
      {!isLoading && !error && <ReportChart data={chartData} />}
    </main>
  );
}
