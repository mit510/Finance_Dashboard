import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import {
  buildPieChartData
} from "../utils/chartData";

const COLORS = ["#4f46e5", "#22c55e", "#ef4444", "#f59e0b"];

export default function Charts({ transactions }) {
  const pieData = buildPieChartData(transactions);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
        <h3 className="font-semibold mb-4">Expense Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
