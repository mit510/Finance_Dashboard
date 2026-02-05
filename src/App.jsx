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
  const refreshTransactions = useCallback(async () => {
    if (user?.uid) {
      const data = await getTransactions(user.uid);
      setTransactions(data);
    }
  }, [user]);

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        const data = await getTransactions(u.uid);
        setTransactions(data);
      } else {
        setTransactions([]);
      }
    });

    return () => unsubscribe();
  }, []);

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