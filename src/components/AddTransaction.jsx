import { useState } from "react";
import { addTransaction } from "../services/transactionService";

export default function AddTransaction({ user, onAdd }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    await addTransaction({
      userId: user.uid,
      amount: Number(amount),
      type,
      category,
      note,
      transactionDate: new Date(date)
    });

    setAmount("");
    setCategory("");
    setNote("");
    setDate(new Date().toISOString().split("T")[0]);

    onAdd();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-8 max-w-md"
    >
      <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>

      <input
        type="number"
        placeholder="Amount"
        className="w-full border p-2 mb-2 rounded"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="date"
        className="w-full border p-2 mb-2 rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        className="w-full border p-2 mb-2 rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="text"
        placeholder="Category"
        className="w-full border p-2 mb-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="text"
        placeholder="Note (optional)"
        className="w-full border p-2 mb-4 rounded"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button className="w-full bg-black text-white py-2 rounded">
        Save
      </button>
    </form>
  );
}
