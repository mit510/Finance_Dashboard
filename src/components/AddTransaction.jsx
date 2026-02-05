import { useState } from "react";
import { addTransaction } from "../services/transactionService";
import { DollarSign, Tag, FileText, Plus, Check } from "lucide-react";
import ModernDatePicker from "./ModernDatePicker";

export default function AddTransaction({ user, onAdd }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Predefined categories
  const categories = {
    expense: [
      "Food & Dining",
      "Transportation",
      "Shopping",
      "Entertainment",
      "Bills & Utilities",
      "Healthcare",
      "Education",
      "Other"
    ],
    income: [
      "Salary",
      "Freelance",
      "Investment",
      "Gift",
      "Bonus",
      "Other"
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    setLoading(true);
    
    try {
      await addTransaction({
        userId: user.uid,
        amount: Number(amount),
        type,
        category,
        note,
        transactionDate: new Date(date)
      });

      // Show success state
      setSuccess(true);
      
      // Reset form
      setAmount("");
      setCategory("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);

      // Refresh transactions
      await onAdd();

      // Reset success state after animation
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral-100 dark:border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
          <Plus size={24} />
          Add New Transaction
        </h2>
        <p className="text-primary-100 text-sm mt-1">
          Record your income or expense
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Type Selector */}
        <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-700 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setType("expense");
              setCategory("");
            }}
            className={`
              flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
              ${type === "expense" 
                ? 'bg-white dark:bg-neutral-800 text-danger-600 dark:text-danger-400 shadow-sm' 
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }
            `}
          >
            💸 Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setType("income");
              setCategory("");
            }}
            className={`
              flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
              ${type === "income" 
                ? 'bg-white dark:bg-neutral-800 text-success-600 dark:text-success-400 shadow-sm' 
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }
            `}
          >
            💰 Income
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Amount */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
                <DollarSign size={18} />
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                className="w-full pl-11 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl 
                         focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 focus:border-primary-500 
                         transition-all outline-none bg-neutral-50 dark:bg-neutral-700 focus:bg-white dark:focus:bg-neutral-600
                         text-lg font-semibold text-neutral-900 dark:text-white"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Modern Date Picker */}
          <div className="md:col-span-1">
            <ModernDatePicker 
              value={date}
              onChange={setDate}
              label="Date"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
              <Tag size={18} />
            </div>
            <select
              required
              className="w-full pl-11 pr-10 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl 
                       focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 focus:border-primary-500 
                       transition-all outline-none bg-neutral-50 dark:bg-neutral-700 focus:bg-white dark:focus:bg-neutral-600
                       appearance-none cursor-pointer text-neutral-900 dark:text-white font-medium"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Note <span className="text-neutral-400 dark:text-neutral-500 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none text-neutral-400 dark:text-neutral-500">
              <FileText size={18} />
            </div>
            <textarea
              placeholder="Add a description..."
              rows={3}
              className="w-full pl-11 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl 
                       focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 focus:border-primary-500 
                       transition-all outline-none bg-neutral-50 dark:bg-neutral-700 focus:bg-white dark:focus:bg-neutral-600
                       resize-none text-neutral-900 dark:text-white"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || success}
          className={`
            w-full py-3.5 rounded-xl font-semibold text-white
            transition-all duration-300 transform active:scale-[0.98]
            shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
            ${success 
              ? 'bg-success-500 hover:bg-success-600' 
              : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
            }
          `}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : success ? (
            <>
              <Check size={20} className="animate-scale-in" />
              <span>Transaction Added!</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>Add Transaction</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}