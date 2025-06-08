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

const data = [
  { name: "S", value: 4 },
  { name: "S", value: 5 },
  { name: "K", value: 6 },
  { name: "K", value: 7 },
  { name: "J", value: 9 },
  { name: "S", value: 8 },
];

export default function MonthlyPresenceChart() {
  return (
    <div className="bg-white rounded-lg p-6 shadow border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-base font-semibold">Kehadiran Bulanan</h4>
        <span className="text-xs text-gray-400">Update: Minggu ini</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={30}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 12]} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend />
          <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
