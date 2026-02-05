import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function SavingsTrendLine({ transactions }) {
  const monthly = {};

  transactions.forEach(t => {
    const d = t.transactionDate.toDate();
    const key = `${d.getFullYear()}-${d.getMonth()}`;

    if (!monthly[key]) {
      monthly[key] = { income: 0, expense: 0 };
    }

    if (t.type === "income") monthly[key].income += t.amount;
    else monthly[key].expense += t.amount;
  });

  const data = Object.entries(monthly).map(([key, val]) => ({
    month: key,
    savings: val.income - val.expense
  }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Savings Trend</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="savings"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
