import { useState, useEffect } from "react";
import { addTransaction } from "../services/transactionService";
import { DollarSign, Tag, FileText, Plus, Check, Calculator } from "lucide-react";
import ModernDatePicker from "./ModernDatePicker";

export default function AddTransactionWithTax({ user, onAdd }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Tax entry states
  const [taxAmount, setTaxAmount] = useState("");
  const [isUberPay, setIsUberPay] = useState(false);
  const [netPay, setNetPay] = useState(0);

  // Predefined categories with Uber Pay option
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
      "Uber Pay",
      "Other"
    ]
  };

  // Calculate net pay when amount or tax changes
  useEffect(() => {
    if (type === "income" && amount && !isUberPay) {
      const gross = parseFloat(amount) || 0;
      const tax = parseFloat(taxAmount) || 0;
      setNetPay(Math.round((gross - tax) * 100) / 100);
    } else if (type === "income" && isUberPay) {
      setNetPay(parseFloat(amount) || 0);
    } else {
      setNetPay(0);
    }
  }, [amount, taxAmount, type, isUberPay]);

  // Check if Uber Pay is selected
  useEffect(() => {
    const isUber = category === "Uber Pay";
    setIsUberPay(isUber);
    if (isUber) {
      setTaxAmount("0");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    // Validate tax amount for non-Uber income
    if (type === "income" && !isUberPay && !taxAmount) {
      alert("Please enter the tax amount from your pay stub");
      return;
    }

    setLoading(true);
    
    try {
      const transactionData = {
        userId: user.uid,
        amount: Number(amount),
        type,
        category,
        note,
        transactionDate: new Date(date)
      };

      // Add tax information for income transactions
      if (type === "income") {
        if (isUberPay) {
          // Uber Pay - no tax deduction
          transactionData.grossPay = Number(amount);
          transactionData.netPay = Number(amount);
          transactionData.totalTax = 0;
        } else {
          // Regular income with manual tax entry
          transactionData.grossPay = Number(amount);
          transactionData.totalTax = Number(taxAmount);
          transactionData.netPay = netPay;
        }
      }

      await addTransaction(transactionData);

      // Show success state
      setSuccess(true);
      
      // Reset form
      setAmount("");
      setTaxAmount("");
      setCategory("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
      setNetPay(0);

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
              setTaxAmount("");
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
              {type === "income" && !isUberPay ? "Gross Pay (from pay stub)" : "Amount"}
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

          {/* Tax Amount - Only for regular income (not Uber, not expenses) */}
          {type === "income" && !isUberPay && (
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Total Tax (from pay stub)
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
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(e.target.value)}
                />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Enter total deductions (Federal + Provincial + CPP + EI)
              </p>
            </div>
          )}

          {/* Date Picker - Show in right column if no tax field */}
          {(type === "expense" || isUberPay) && (
            <div className="md:col-span-1">
              <ModernDatePicker 
                value={date}
                onChange={setDate}
                label="Date"
              />
            </div>
          )}
        </div>

        {/* Date Picker - Show full width if tax field is shown */}
        {type === "income" && !isUberPay && (
          <div>
            <ModernDatePicker 
              value={date}
              onChange={setDate}
              label="Date"
            />
          </div>
        )}

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

        {/* Net Pay Display - Only for regular income with tax */}
        {type === "income" && !isUberPay && amount && taxAmount && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-700 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="text-blue-600 dark:text-blue-400" size={20} />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Pay Summary</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-blue-200 dark:border-blue-700">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Gross Pay:</span>
                <span className="text-lg font-bold text-blue-900 dark:text-blue-100">${parseFloat(amount).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-blue-900 dark:text-blue-100">Total Tax:</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">-${parseFloat(taxAmount).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 bg-green-100 dark:bg-green-900/30 -mx-5 px-5 py-3 rounded-b-lg">
                <span className="font-bold text-green-900 dark:text-green-100">Net Pay (take home):</span>
                <span className="text-xl font-bold text-green-700 dark:text-green-400">${netPay.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Uber Pay Notice */}
        {type === "income" && isUberPay && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/60 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚗</span>
              <div>
                <p className="font-semibold text-purple-900 dark:text-purple-100">Uber Pay - No Tax Deduction</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">This income will be recorded as-is without tax calculations</p>
              </div>
            </div>
          </div>
        )}

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