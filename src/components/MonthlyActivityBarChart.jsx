import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function MonthlyActivityBarChart({ transactions }) {
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") {
      income += Number(t.amount);
    } else {
      expense += Number(t.amount);
    }
  });

  const data = [
    {
      name: "This Month",
      Income: income,
      Expense: expense,
      Savings: income - expense
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Monthly Activity
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Income" />
          <Bar dataKey="Expense" />
          <Bar dataKey="Savings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
