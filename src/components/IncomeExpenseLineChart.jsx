import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function IncomeExpenseLineChart({ transactions }) {
  const monthlyData = {};

  transactions.forEach((t) => {
    const date = t.transactionDate.toDate();
    const month = date.toLocaleString("default", { month: "short", year: "numeric" });

    if (!monthlyData[month]) {
      monthlyData[month] = {
        month,
        income: 0,
        expense: 0
      };
    }

    if (t.type === "income") {
      monthlyData[month].income += Number(t.amount);
    } else {
      monthlyData[month].expense += Number(t.amount);
    }
  });

  const chartData = Object.values(monthlyData);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Income vs Expense (Monthly)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" strokeWidth={2} />
          <Line type="monotone" dataKey="expense" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
