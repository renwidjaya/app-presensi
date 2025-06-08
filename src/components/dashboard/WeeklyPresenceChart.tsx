import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "S", value: 2 },
  { name: "S", value: 4 },
  { name: "R", value: 6 },
  { name: "K", value: 8 },
  { name: "J", value: 7 },
  { name: "S", value: 9 },
  { name: "S", value: 10 },
];

export default function WeeklyPresenceChart() {
  return (
    <div className="bg-white rounded-lg p-6 shadow border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-base font-semibold">Kehadiran Mingguan</h4>
        <span className="text-xs text-gray-400">Update: Hari ini</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 12]} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
