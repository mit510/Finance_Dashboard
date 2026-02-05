import { useState } from "react";
import { deleteTransaction, updateTransaction } from "../services/transactionService";
import { Timestamp } from "firebase/firestore";
import { Edit2, Trash2, Save, X, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function TransactionList({ transactions, refresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deletingId, setDeletingId] = useState(null);

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

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteTransaction(id);
    await refresh();
    setDeletingId(null);
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.transactionDate?.toDate?.() || new Date();
    const dateKey = date.toDateString();
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {});

  return (
    <div className="bg-white rounded-2xl shadow-card border border-neutral-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 px-6 py-4">
        <h2 className="text-xl font-bold text-white font-display">
          Recent Transactions
        </h2>
        <p className="text-neutral-300 text-sm mt-1">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} this period
        </p>
      </div>

      <div className="p-6">
        {transactions.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No transactions yet
            </h3>
            <p className="text-neutral-500 text-sm">
              Start tracking by adding your first transaction above
            </p>
          </div>
        ) : (
          /* Transactions List */
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => (
              <div key={dateKey} className="animate-slide-up">
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-neutral-200"></div>
                  <span className="text-sm font-medium text-neutral-500 px-3">
                    {new Date(dateKey).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <div className="flex-1 h-px bg-neutral-200"></div>
                </div>

                {/* Transactions for this date */}
                <div className="space-y-2">
                  {dayTransactions.map((t) => (
                    <div 
                      key={t.id} 
                      className={`
                        rounded-xl border transition-all duration-200
                        ${deletingId === t.id 
                          ? 'opacity-50 scale-95' 
                          : 'hover:shadow-md'
                        }
                        ${editingId === t.id
                          ? 'border-primary-300 bg-primary-50/50 shadow-lg'
                          : 'border-neutral-200 bg-white'
                        }
                      `}
                    >
                      {editingId === t.id ? (
                        /* ✏️ EDIT MODE */
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Amount"
                              value={editData.amount}
                              onChange={(e) =>
                                setEditData({ ...editData, amount: e.target.value })
                              }
                              className="px-4 py-2 border border-neutral-300 rounded-lg 
                                       focus:ring-2 focus:ring-primary-200 focus:border-primary-500 
                                       transition-all outline-none"
                            />

                            <input
                              type="date"
                              value={editData.transactionDate}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  transactionDate: e.target.value
                                })
                              }
                              className="px-4 py-2 border border-neutral-300 rounded-lg 
                                       focus:ring-2 focus:ring-primary-200 focus:border-primary-500 
                                       transition-all outline-none"
                            />

                            <input
                              type="text"
                              placeholder="Category"
                              value={editData.category}
                              onChange={(e) =>
                                setEditData({ ...editData, category: e.target.value })
                              }
                              className="px-4 py-2 border border-neutral-300 rounded-lg 
                                       focus:ring-2 focus:ring-primary-200 focus:border-primary-500 
                                       transition-all outline-none"
                            />

                            <select
                              value={editData.type}
                              onChange={(e) =>
                                setEditData({ ...editData, type: e.target.value })
                              }
                              className="px-4 py-2 border border-neutral-300 rounded-lg 
                                       focus:ring-2 focus:ring-primary-200 focus:border-primary-500 
                                       transition-all outline-none"
                            >
                              <option value="income">Income</option>
                              <option value="expense">Expense</option>
                            </select>
                          </div>

                          <input
                            type="text"
                            placeholder="Note (optional)"
                            value={editData.note}
                            onChange={(e) =>
                              setEditData({ ...editData, note: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg 
                                     focus:ring-2 focus:ring-primary-200 focus:border-primary-500 
                                     transition-all outline-none"
                          />

                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => saveEdit(t.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-success-500 
                                       hover:bg-success-600 text-white rounded-lg font-medium
                                       transition-all active:scale-95"
                            >
                              <Save size={16} />
                              Save
                            </button>

                            <button
                              onClick={() => setEditingId(null)}
                              className="flex items-center gap-2 px-4 py-2 bg-neutral-200 
                                       hover:bg-neutral-300 text-neutral-700 rounded-lg font-medium
                                       transition-all active:scale-95"
                            >
                              <X size={16} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* 👀 VIEW MODE */
                        <div className="p-4 flex items-center justify-between gap-4">
                          {/* Left: Category & Details */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Icon */}
                            <div className={`
                              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                              ${t.type === "income" 
                                ? 'bg-success-100 text-success-600' 
                                : 'bg-danger-100 text-danger-600'
                              }
                            `}>
                              {t.type === "income" ? (
                                <ArrowDownRight size={20} />
                              ) : (
                                <ArrowUpRight size={20} />
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-neutral-900 capitalize truncate">
                                  {t.category}
                                </p>
                                <span className={`
                                  px-2 py-0.5 text-xs font-medium rounded-full
                                  ${t.type === "income" 
                                    ? 'bg-success-100 text-success-700' 
                                    : 'bg-danger-100 text-danger-700'
                                  }
                                `}>
                                  {t.type}
                                </span>
                              </div>
                              {t.note && (
                                <p className="text-sm text-neutral-500 mt-0.5 truncate">
                                  {t.note}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right: Amount & Actions */}
                          <div className="flex items-center gap-4">
                            {/* Amount */}
                            <div className="text-right">
                              <p className={`
                                text-lg font-bold
                                ${t.type === "income" 
                                  ? 'text-success-600' 
                                  : 'text-danger-600'
                                }
                              `}>
                                {t.type === "income" ? '+' : '-'}${Number(t.amount).toLocaleString()}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => startEdit(t)}
                                className="p-2 text-primary-600 hover:bg-primary-50 
                                         rounded-lg transition-all active:scale-90"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>

                              <button
                                onClick={() => handleDelete(t.id)}
                                disabled={deletingId === t.id}
                                className="p-2 text-danger-600 hover:bg-danger-50 
                                         rounded-lg transition-all active:scale-90
                                         disabled:opacity-50"
                                title="Delete"
                              >
                                {deletingId === t.id ? (
                                  <div className="w-4 h-4 border-2 border-danger-600/30 border-t-danger-600 rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}