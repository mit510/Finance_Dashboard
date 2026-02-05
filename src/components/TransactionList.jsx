import { useState } from "react";
import { deleteTransaction, updateTransaction } from "../services/transactionService";
import { Timestamp } from "firebase/firestore";

export default function TransactionList({ transactions, refresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (t) => {
    setEditingId(t.id);

    const date = t.transactionDate?.toDate
      ? t.transactionDate.toDate().toISOString().split("T")[0]
      : "";

    setEditData({
      amount: t.amount,
      category: t.category,
      type: t.type,
      note: t.note || "",
      transactionDate: date
    });
  };

  const saveEdit = async (id) => {
    await updateTransaction(id, {
      ...editData,
      transactionDate: Timestamp.fromDate(
        new Date(editData.transactionDate)
      )
    });

    setEditingId(null);
    refresh();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-10">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((t) => (
            <li key={t.id} className="border-b pb-4">
              {editingId === t.id ? (
                /* ✏️ EDIT MODE */
                <div className="space-y-2">
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) =>
                      setEditData({ ...editData, amount: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />

                  <input
                    type="text"
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />

                  <select
                    value={editData.type}
                    onChange={(e) =>
                      setEditData({ ...editData, type: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>

                  {/* 📅 DATE EDIT */}
                  <input
                    type="date"
                    value={editData.transactionDate}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        transactionDate: e.target.value
                      })
                    }
                    className="border p-2 rounded w-full"
                  />

                  <input
                    type="text"
                    placeholder="Note"
                    value={editData.note}
                    onChange={(e) =>
                      setEditData({ ...editData, note: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => saveEdit(t.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* 👀 VIEW MODE */
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium capitalize">
                      {t.category} ({t.type})
                    </p>
                    <p className="text-sm text-gray-500">
                      {t.transactionDate?.toDate
                        ? t.transactionDate.toDate().toDateString()
                        : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={
                        t.type === "income"
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      ${t.amount}
                    </span>

                    <button
                      onClick={() => startEdit(t)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={async () => {
                        await deleteTransaction(t.id);
                        refresh();
                      }}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
