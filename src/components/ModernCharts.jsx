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
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

// Modern gradient colors
const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

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
      </div>
    );
  }
  return null;
};

// Modern Area Chart (Income vs Expense)
export function ModernIncomeExpenseChart({ transactions }) {
  const monthlyData = {};

  transactions.forEach((t) => {
    const date = t.transactionDate.toDate();
    const month = date.toLocaleString("default", { month: "short", year: "numeric" });

    if (!monthlyData[month]) {
      monthlyData[month] = { month, income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyData[month].income += Number(t.amount);
    } else {
      monthlyData[month].expense += Number(t.amount);
    }
  });

  const chartData = Object.values(monthlyData);

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral-100 dark:border-neutral-700">
      <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
        Income vs Expenses Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#d1d5db"
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#d1d5db"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Area 
            type="monotone" 
            dataKey="income" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorIncome)"
            strokeWidth={3}
          />
          <Area 
            type="monotone" 
            dataKey="expense" 
            stroke="#ef4444" 
            fillOpacity={1} 
            fill="url(#colorExpense)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Modern Bar Chart (Monthly Activity)
export function ModernMonthlyBarChart({ transactions }) {
  const data = transactions.reduce((acc, t) => {
    const category = t.category;
    if (!acc[category]) {
      acc[category] = { category, amount: 0 };
    }
    acc[category].amount += Number(t.amount);
    return acc;
  }, {});

  const chartData = Object.values(data).sort((a, b) => b.amount - a.amount).slice(0, 8);

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral-100 dark:border-neutral-700">
      <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
        Top Spending Categories
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.6}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="category" 
            tick={{ fill: '#6b7280', fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
            stroke="#d1d5db"
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#d1d5db"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="amount" 
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Spending by Category Pie Chart
export function SpendingPieChart({ transactions }) {
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category;
      if (!acc[category]) {
        acc[category] = { name: category, value: 0 };
      }
      acc[category].value += Number(t.amount);
      return acc;
    }, {});

  const chartData = Object.values(categoryData).sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral-100 dark:border-neutral-700">
      <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
        Expense Distribution
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}