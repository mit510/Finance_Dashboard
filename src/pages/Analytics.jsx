import { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  DollarSign,
  PieChart as PieChartIcon,
  Target,
  Lightbulb
} from 'lucide-react';
import { SpendingPieChart } from '../components/ModernCharts';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export default function Analytics({ transactions }) {
  // Calculate analytics data
  const analytics = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    // Total amounts
    const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalIncome = income.reduce((sum, t) => sum + Number(t.amount), 0);

    // Category breakdown
    const categorySpending = expenses.reduce((acc, t) => {
      const cat = t.category;
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += Number(t.amount);
      return acc;
    }, {});

    const topCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / totalExpenses) * 100).toFixed(1)
      }));

    // Day of week spending
    const daySpending = expenses.reduce((acc, t) => {
      const day = t.transactionDate.toDate().toLocaleDateString('en-US', { weekday: 'short' });
      if (!acc[day]) acc[day] = 0;
      acc[day] += Number(t.amount);
      return acc;
    }, {});

    // Average transaction
    const avgTransaction = expenses.length > 0 
      ? (totalExpenses / expenses.length).toFixed(2) 
      : 0;

    // Savings rate
    const savingsRate = totalIncome > 0 
      ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
      : 0;

    // Generate insights
    const insights = generateInsights(categorySpending, totalExpenses, savingsRate);

    return {
      totalExpenses,
      totalIncome,
      topCategories,
      daySpending,
      avgTransaction,
      savingsRate,
      insights
    };
  }, [transactions]);

  // Week day chart data
  const weekData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    amount: analytics.daySpending[day] || 0
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white font-display">
          Financial Analytics 📊
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Detailed insights into your spending patterns
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Spent"
          value={`$${analytics.totalExpenses.toLocaleString()}`}
          icon={DollarSign}
          color="primary"
        />
        <MetricCard 
          title="Avg Transaction"
          value={`$${analytics.avgTransaction}`}
          icon={TrendingDown}
          color="danger"
        />
        <MetricCard 
          title="Savings Rate"
          value={`${analytics.savingsRate}%`}
          icon={Target}
          color={analytics.savingsRate > 20 ? "success" : "warning"}
        />
        <MetricCard 
          title="Total Income"
          value={`$${analytics.totalIncome.toLocaleString()}`}
          icon={TrendingUp}
          color="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingPieChart transactions={transactions} />
        
        {/* Day of Week Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-card border border-neutral-100 dark:border-neutral-700">
          <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
            Spending by Day of Week
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280' }} stroke="#d1d5db" />
              <YAxis tick={{ fill: '#6b7280' }} stroke="#d1d5db" />
              <Tooltip />
              <Bar dataKey="amount" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Spending Categories */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-card border border-neutral-100 dark:border-neutral-700">
        <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white flex items-center gap-2">
          <PieChartIcon size={24} className="text-primary-500" />
          Top Spending Categories
        </h2>
        
        <div className="space-y-4">
          {analytics.topCategories.map((cat, index) => (
            <div key={cat.category}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-neutral-900 dark:text-white capitalize">
                  {cat.category}
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  ${cat.amount.toLocaleString()} ({cat.percentage}%)
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percentage}%`,
                    background: `linear-gradient(to right, ${GRADIENT_COLORS[index % GRADIENT_COLORS.length]})`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-primary-50 to-success-50 dark:from-primary-900/20 dark:to-success-900/20 p-6 rounded-2xl shadow-card border border-primary-100 dark:border-primary-800">
        <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white flex items-center gap-2">
          <Lightbulb size={24} className="text-warning" />
          Smart Insights & Recommendations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon: Icon, color }) {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success to-success-dark',
    danger: 'from-danger to-danger-dark',
    warning: 'from-warning to-warning-dark'
  };

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral-100 dark:border-neutral-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 bg-gradient-to-br ${colors[color]} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Insight Card Component
function InsightCard({ insight }) {
  const iconMap = {
    warning: AlertCircle,
    success: TrendingUp,
    info: Lightbulb
  };

  const colorMap = {
    warning: 'text-warning bg-warning/10 border-warning/20',
    success: 'text-success bg-success/10 border-success/20',
    info: 'text-primary-600 bg-primary-50 border-primary-200'
  };

  const Icon = iconMap[insight.type] || Lightbulb;

  return (
    <div className={`p-4 rounded-xl border ${colorMap[insight.type]} dark:bg-opacity-20`}>
      <div className="flex items-start gap-3">
        <Icon size={20} className="flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
            {insight.title}
          </h3>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {insight.message}
          </p>
        </div>
      </div>
    </div>
  );
}

// Generate AI-like insights
function generateInsights(categorySpending, totalExpenses, savingsRate) {
  const insights = [];
  const sortedCategories = Object.entries(categorySpending).sort(([, a], [, b]) => b - a);

  // Top spending category insight
  if (sortedCategories.length > 0) {
    const [topCategory, amount] = sortedCategories[0];
    const percentage = ((amount / totalExpenses) * 100).toFixed(0);
    insights.push({
      type: 'warning',
      title: 'Highest Spending Area',
      message: `${topCategory} accounts for ${percentage}% of your expenses ($${amount.toLocaleString()}). Consider ways to reduce this category.`
    });
  }

  // Savings rate insight
  if (savingsRate < 10) {
    insights.push({
      type: 'warning',
      title: 'Low Savings Rate',
      message: `Your savings rate is ${savingsRate}%. Financial experts recommend saving at least 20% of your income. Try cutting discretionary spending.`
    });
  } else if (savingsRate > 30) {
    insights.push({
      type: 'success',
      title: 'Excellent Savings!',
      message: `You're saving ${savingsRate}% of your income! You're on track for strong financial health. Keep it up!`
    });
  }

  // Multiple high-spend categories
  if (sortedCategories.length >= 3) {
    const top3Total = sortedCategories.slice(0, 3).reduce((sum, [, amt]) => sum + amt, 0);
    const top3Percentage = ((top3Total / totalExpenses) * 100).toFixed(0);
    
    insights.push({
      type: 'info',
      title: 'Spending Concentration',
      message: `Your top 3 categories (${sortedCategories.slice(0, 3).map(([cat]) => cat).join(', ')}) represent ${top3Percentage}% of total spending.`
    });
  }

  // Budget recommendation
  const avgDaily = (totalExpenses / 30).toFixed(2);
  insights.push({
    type: 'info',
    title: 'Daily Budget Suggestion',
    message: `Your average daily spending is $${avgDaily}. Try setting a daily budget of $${(avgDaily * 0.8).toFixed(2)} to reduce expenses by 20%.`
  });

  return insights;
}

const GRADIENT_COLORS = [
  '#0ea5e9, #0284c7',
  '#8b5cf6, #7c3aed',
  '#ec4899, #db2777',
  '#f59e0b, #d97706',
  '#10b981, #059669',
  '#ef4444, #dc2626'
];