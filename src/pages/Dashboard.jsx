import { useState, useMemo } from "react";
import AddTransaction from "../components/AddTransaction";
import TransactionList from "../components/TransactionList";
import Analytics from "./Analytics";
import Settings from "./Settings";
import { logout } from "../services/auth";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank,
  LogOut,
  Menu,
  X,
  Settings as SettingsIcon,
  BarChart3,
  Home
} from "lucide-react";

import { ModernIncomeExpenseChart, ModernMonthlyBarChart } from "../components/ModernCharts";
import SavingsTrendLine from "../components/SavingsTrendLine";
import YearlyComparisonBar from "../components/YearlyComparisonBar";

export default function Dashboard({
  user,
  transactions,
  refreshTransactions
}) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); // dashboard, analytics, settings

  // 🔹 Filter transactions by month & year
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.transactionDate) return false;

      const d = t.transactionDate.toDate
        ? t.transactionDate.toDate()
        : new Date(t.transactionDate);

      return (
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  // 🔹 Stats (from filtered data)
  const income = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const savings = income - expenses;

  // Calculate trends (compare to previous month)
  const prevMonthTransactions = useMemo(() => {
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    
    return transactions.filter((t) => {
      if (!t.transactionDate) return false;
      const d = t.transactionDate.toDate?.() || new Date(t.transactionDate);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const prevIncome = prevMonthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const prevExpenses = prevMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const incomeTrend = prevIncome ? ((income - prevIncome) / prevIncome * 100).toFixed(1) : 0;
  const expenseTrend = prevExpenses ? ((expenses - prevExpenses) / prevExpenses * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
              {currentPage === 'dashboard' ? 'Dashboard' : currentPage === 'analytics' ? 'Analytics' : 'Settings'}
            </h1>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 z-50
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-glow-primary">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-neutral-900 dark:text-white font-display">Finance</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Tracker</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <NavItem 
              icon={Home} 
              label="Dashboard" 
              active={currentPage === 'dashboard'}
              onClick={() => {
                setCurrentPage('dashboard');
                setSidebarOpen(false);
              }}
            />
            <NavItem 
              icon={BarChart3} 
              label="Analytics" 
              active={currentPage === 'analytics'}
              onClick={() => {
                setCurrentPage('analytics');
                setSidebarOpen(false);
              }}
            />
            <NavItem 
              icon={SettingsIcon} 
              label="Settings" 
              active={currentPage === 'settings'}
              onClick={() => {
                setCurrentPage('settings');
                setSidebarOpen(false);
              }}
            />
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.displayName?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="hidden lg:flex items-center gap-2 w-full mt-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Render different pages */}
          {currentPage === 'dashboard' && (
            <>
              {/* Header */}
              <div className="mb-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white font-display">
                      Welcome back, {user.displayName?.split(' ')[0] || 'User'}! 👋
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                      Here's your financial overview
                    </p>
                  </div>
                </div>
              </div>

              {/* Add Transaction */}
              <div className="mb-8">
                <AddTransaction user={user} onAdd={refreshTransactions} />
              </div>

              {/* Filters - MOVED HERE */}
              <div className="flex flex-wrap gap-3 mb-8 animate-slide-up">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl 
                           bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium 
                           shadow-sm hover:border-primary-400 focus:border-primary-500 focus:ring-2 
                           focus:ring-primary-200 dark:focus:ring-primary-800 transition-all outline-none"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i} value={i}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl 
                           bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium 
                           shadow-sm hover:border-primary-400 focus:border-primary-500 focus:ring-2 
                           focus:ring-primary-200 dark:focus:ring-primary-800 transition-all outline-none"
                >
                  {Array.from(
                    new Set(
                      transactions.map(t =>
                        t.transactionDate?.toDate?.().getFullYear()
                      )
                    )
                  )
                    .filter(Boolean)
                    .sort()
                    .map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                </select>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard 
                  title="Total Income" 
                  value={income} 
                  icon={TrendingUp}
                  trend={incomeTrend}
                  color="success" 
                />
                <StatCard 
                  title="Total Expenses" 
                  value={expenses}
                  icon={TrendingDown}
                  trend={expenseTrend}
                  color="danger" 
                />
                <StatCard 
                  title="Net Savings" 
                  value={savings}
                  icon={PiggyBank}
                  color={savings >= 0 ? "success" : "danger"}
                />
              </div>

              {/* Modern Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <ModernIncomeExpenseChart transactions={filteredTransactions} />
                <ModernMonthlyBarChart transactions={filteredTransactions} />
              </div>

              {/* More Charts */}
              <div className="space-y-6 mb-10">
                <SavingsTrendLine transactions={transactions} />
                <YearlyComparisonBar transactions={transactions} />
              </div>

              {/* Transactions List */}
              <TransactionList
                transactions={filteredTransactions}
                refresh={refreshTransactions}
              />
            </>
          )}

          {currentPage === 'analytics' && (
            <Analytics transactions={transactions} />
          )}

          {currentPage === 'settings' && (
            <Settings user={user} />
          )}
        </div>
      </main>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium
        transition-all duration-200
        ${active 
          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-sm' 
          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700'
        }
      `}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

// Enhanced Stat Card Component
function StatCard({ title, value, icon: Icon, trend, color }) {
  const colors = {
    success: {
      bg: "from-success-50 to-success-100/50 dark:from-success-900/20 dark:to-success-800/10",
      text: "text-success-700 dark:text-success-400",
      icon: "bg-success-500",
      shadow: "shadow-success-500/20",
    },
    danger: {
      bg: "from-danger-50 to-danger-100/50 dark:from-danger-900/20 dark:to-danger-800/10",
      text: "text-danger-700 dark:text-danger-400",
      icon: "bg-danger-500",
      shadow: "shadow-danger-500/20",
    },
    primary: {
      bg: "from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10",
      text: "text-primary-700 dark:text-primary-400",
      icon: "bg-primary-500",
      shadow: "shadow-primary-500/20",
    },
  };

  const colorScheme = colors[color] || colors.primary;
  const isPositive = trend >= 0;

  return (
    <div className={`
      bg-gradient-to-br ${colorScheme.bg} backdrop-blur-sm
      p-6 rounded-2xl shadow-card hover:shadow-card-hover 
      transition-all duration-300 border border-white/50 dark:border-neutral-700
      transform hover:scale-[1.02] animate-slide-up
    `}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">{title}</p>
          <p className={`text-3xl lg:text-4xl font-bold ${colorScheme.text}`}>
            ${value.toLocaleString()}
          </p>
        </div>
        <div className={`
          p-3 ${colorScheme.icon} rounded-xl shadow-lg ${colorScheme.shadow}
        `}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className={`
          flex items-center gap-1 text-sm font-medium
          ${isPositive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}
        `}>
          {isPositive ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span>{Math.abs(trend)}% vs last month</span>
        </div>
      )}
    </div>
  );
}