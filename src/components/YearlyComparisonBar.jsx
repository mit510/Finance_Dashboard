import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function YearlyComparisonBar({ transactions }) {
  const yearly = {};

  transactions.forEach(t => {
    const year = t.transactionDate.toDate().getFullYear();
    if (!yearly[year]) yearly[year] = { income: 0, expense: 0 };

    if (t.type === "income") yearly[year].income += t.amount;
    else yearly[year].expense += t.amount;
  });

  const data = Object.entries(yearly).map(([year, val]) => ({
    year,
    income: val.income,
    expense: val.expense
  }));

  return (
    <div className="bg-white p-4 rounded shadow mt-8">
      <h3 className="font-semibold mb-2">Yearly Comparison</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="income" fill="#16a34a" />
          <Bar dataKey="expense" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
