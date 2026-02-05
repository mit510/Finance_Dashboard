import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
        <p className="font-semibold text-neutral-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
        {payload.length === 2 && (
          <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              Net: ${(payload[0].value - payload[1].value).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function YearlyComparisonBar({ transactions }) {
  const yearly = {};

  transactions.forEach(t => {
    const year = t.transactionDate.toDate().getFullYear();
    if (!yearly[year]) yearly[year] = { income: 0, expense: 0 };

    if (t.type === "income") yearly[year].income += Number(t.amount);
    else yearly[year].expense += Number(t.amount);
  });

  const data = Object.entries(yearly)
    .map(([year, val]) => ({
      year,
      Income: val.income,
      Expenses: val.expense
    }))
    .sort((a, b) => a.year - b.year);

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral-100 dark:border-neutral-700">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Yearly Comparison
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Income vs Expenses by year
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} barGap={8}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.7}/>
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.7}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="year" 
            tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
            stroke="#d1d5db"
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#d1d5db"
            tickLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            iconSize={10}
          />
          <Bar 
            dataKey="Income" 
            fill="url(#incomeGradient)"
            radius={[8, 8, 0, 0]}
            maxBarSize={80}
          />
          <Bar 
            dataKey="Expenses" 
            fill="url(#expenseGradient)"
            radius={[8, 8, 0, 0]}
            maxBarSize={80}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}