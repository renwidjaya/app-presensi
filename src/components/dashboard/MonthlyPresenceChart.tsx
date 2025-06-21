import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchDashboardStatistik } from "../../api";

interface ChartData {
  label: string;
  count: number;
}

export default function MonthlyPresenceChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStatistik()
      .then((res) => {
        setChartData(res.chart_bulanan || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading chart...</p>;

  return (
    <div className="bg-white rounded-lg p-6 shadow border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-base font-semibold">Kehadiran Bulanan</h4>
        <span className="text-xs text-gray-400">Update: Minggu ini</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barSize={30}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 12]} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend />
          <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
