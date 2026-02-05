import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { getTransactions } from "./services/transactionService";

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch transactions
  const refreshTransactions = useCallback(async (uid) => {
    if (!uid) return;
    const data = await getTransactions(uid);
    setTransactions(data);
  }, []);

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        await refreshTransactions(u.uid);
      } else {
        setTransactions([]);
      }
    });

    return () => unsubscribe();
  }, [refreshTransactions]);

  // 💰 Calculations (safe numbers)
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const savings = income - expenses;

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  // 🔑 Not logged in
  if (!user) {
    return <Login />;
  }

  // ✅ Logged in
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard
        user={user}
        income={income}
        expenses={expenses}
        savings={savings}
        transactions={transactions}
        refreshTransactions={refreshTransactions}
      />
    </div>
  );
}

export default App;
