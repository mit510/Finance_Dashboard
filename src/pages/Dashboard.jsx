import { useState, useMemo } from "react";
import AddTransaction from "../components/AddTransaction";
import TransactionList from "../components/TransactionList";
import { logout } from "../services/auth";

import IncomeExpenseLineChart from "../components/IncomeExpenseLineChart";
import MonthlyActivityBarChart from "../components/MonthlyActivityBarChart";
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

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">

      {/* 🔹 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome {user.displayName} 🎉
          </h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* 🔹 Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
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

      {/* 🔹 Add Transaction */}
      <AddTransaction user={user} onAdd={refreshTransactions} />

      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Stat title="Income" value={income} color="green" />
        <Stat title="Expenses" value={expenses} color="red" />
        <Stat title="Savings" value={savings} color="blue" />
      </div>

      {/* 🔹 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <IncomeExpenseLineChart transactions={filteredTransactions} />
        <MonthlyActivityBarChart transactions={filteredTransactions} />
      </div>

      {/* 🔹 Transactions List */}
      <SavingsTrendLine transactions={transactions} />
      <YearlyComparisonBar transactions={transactions} />

      <TransactionList
        transactions={filteredTransactions}
        refresh={refreshTransactions}
      />
    </div>
  );
}

// 🔹 Tailwind-safe Stat component
function Stat({ title, value, color }) {
  const colors = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-gray-500">{title}</h2>
      <p className={`text-3xl font-bold ${colors[color]}`}>
        ${value}
      </p>
    </div>
  );
}
