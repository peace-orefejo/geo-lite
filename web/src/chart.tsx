import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';
import { formatDay, formatPercent } from './chartData';
import type { ChartPoint } from './chartData';

type ReportChartProps = {
  data: ChartPoint[];
};

function ChartTooltip({
  active,
  payload,
}: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload as ChartPoint;

  return (
    <div className="chart-tooltip">
      <strong>{formatDay(point.date)}</strong>
      <dl>
        <dt>Share of voice</dt>
        <dd>{formatPercent(point.shareOfVoice)}</dd>
        <dt>Mention rate</dt>
        <dd>{formatPercent(point.mentionRate)}</dd>
        <dt>Sentiment</dt>
        <dd>{point.sentiment ?? '—'}</dd>
        <dt>Responses</dt>
        <dd>{point.responseCount}</dd>
      </dl>
    </div>
  );
}

export default function ReportChart({ data }: ReportChartProps) {
  return (
    <div className="chart">
      <LineChart
        style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
        responsive
        data={data}
        margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
      >
        <CartesianGrid strokeDasharray="5 5" stroke="var(--grid)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDay}
          stroke="var(--text-secondary)"
          fontSize={12}
        />
        <YAxis
          width="auto"
          domain={[0, 1]}
          ticks={[0, 0.25, 0.5, 0.75, 1]}
          tickFormatter={(value: number) => formatPercent(value)}
          stroke="var(--text-secondary)"
          fontSize={12}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend />
        <Line
          type="linear"
          dataKey="shareOfVoice"
          name="Share of voice"
          stroke="var(--series-share)"
          strokeWidth={2}
          isAnimationActive={false}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="linear"
          dataKey="mentionRate"
          name="Mention rate"
          stroke="var(--series-mention)"
          strokeWidth={2}
          isAnimationActive={false}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </div>
  );
}
