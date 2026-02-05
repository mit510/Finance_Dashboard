import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine
} from "recharts";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const isPositive = value >= 0;
    
    return (
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
        <p className="font-semibold text-neutral-900 dark:text-white mb-2">{label}</p>
        <p className={`text-sm font-semibold ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
          Savings: ${value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function SavingsTrendLine({ transactions }) {
  const monthly = {};

  transactions.forEach(t => {
    const d = t.transactionDate.toDate();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const displayMonth = d.toLocaleDateString('default', { month: 'short', year: 'numeric' });

    if (!monthly[key]) {
      monthly[key] = { month: displayMonth, income: 0, expense: 0 };
    }

    if (t.type === "income") monthly[key].income += Number(t.amount);
    else monthly[key].expense += Number(t.amount);
  });

  const data = Object.keys(monthly)
    .sort()
    .map(key => ({
      month: monthly[key].month,
      savings: monthly[key].income - monthly[key].expense
    }));

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral-100 dark:border-neutral-700">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Savings Trend
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Monthly savings over time
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#d1d5db"
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#d1d5db"
            tickLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={0} 
            stroke="#ef4444" 
            strokeDasharray="3 3"
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="savings"
            stroke="#8b5cf6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#savingsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}