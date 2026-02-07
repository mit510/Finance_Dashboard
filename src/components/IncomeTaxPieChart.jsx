import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";

export default function IncomeTaxPieChart({ transactions }) {
  const taxData = useMemo(() => {
    // Filter income transactions
    const incomeTransactions = transactions.filter(t => t.type === "income");
    
    let totalGrossPay = 0;
    let totalTax = 0;
    let totalNetPay = 0;
    
    incomeTransactions.forEach(t => {
      if (t.grossPay) {
        totalGrossPay += t.grossPay;
        totalTax += t.totalTax || 0;
        totalNetPay += t.netPay || t.amount;
      } else {
        // For older transactions without tax data
        totalGrossPay += t.amount;
        totalNetPay += t.amount;
      }
    });

    return {
      totalGrossPay: Math.round(totalGrossPay * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      totalNetPay: Math.round(totalNetPay * 100) / 100,
      taxPercentage: totalGrossPay > 0 ? ((totalTax / totalGrossPay) * 100).toFixed(1) : 0,
      netPercentage: totalGrossPay > 0 ? ((totalNetPay / totalGrossPay) * 100).toFixed(1) : 0
    };
  }, [transactions]);

  const pieData = [
    { name: "Net Income", value: taxData.totalNetPay, color: "#10b981" },
    { name: "Total Tax", value: taxData.totalTax, color: "#ef4444" }
  ];

  const COLORS = ["#10b981", "#ef4444"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
          <p className="font-semibold text-neutral-900 dark:text-white">{payload[0].name}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
            ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {payload[0].name === "Net Income" ? taxData.netPercentage : taxData.taxPercentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  if (taxData.totalGrossPay === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral-100 dark:border-neutral-700 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign size={20} />
            Income vs Tax Overview
          </h3>
        </div>
        <div className="p-12 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">No income data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral-100 dark:border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <DollarSign size={20} />
          Income vs Tax Overview
        </h3>
        <p className="text-green-100 text-sm mt-1">
          Your total income and tax breakdown
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Total Gross Income</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              ${taxData.totalGrossPay.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100/60 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
            <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Net Income</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              ${taxData.totalNetPay.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {taxData.netPercentage}% of gross
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100/60 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-200 dark:border-red-700">
            <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Total Tax Paid</p>
            <p className="text-2xl font-bold text-red-900 dark:text-red-100">
              ${taxData.totalTax.toLocaleString()}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {taxData.taxPercentage}% of gross
            </p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                    {value}: ${entry.payload.value.toLocaleString()}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Insights */}
        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-primary-600 dark:text-primary-400" size={18} />
            <h4 className="font-semibold text-neutral-900 dark:text-white">Quick Insights</h4>
          </div>
          <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li>• You're keeping <span className="font-bold text-green-600 dark:text-green-400">{taxData.netPercentage}%</span> of your gross income</li>
            <li>• Tax deductions account for <span className="font-bold text-red-600 dark:text-red-400">{taxData.taxPercentage}%</span> of your gross income</li>
            <li>• Total net income: <span className="font-bold">${taxData.totalNetPay.toLocaleString()}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}