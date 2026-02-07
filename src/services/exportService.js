import { getTransactions } from './transactionService';
import { getUserData } from './userService';

/**
 * Export user data to JSON file
 */
export const exportToJSON = async (userId, userName) => {
  try {
    // Get all user data
    const transactions = await getTransactions(userId);
    const userData = await getUserData(userId);

    // Prepare export data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: userId,
        name: userData?.name || userName,
        email: userData?.email || ''
      },
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        category: t.category,
        amount: t.amount,
        description: t.description,
        date: t.date,
        createdAt: t.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })),
      summary: {
        totalTransactions: transactions.length,
        totalIncome: transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0),
        totalExpense: transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0)
      }
    };

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, count: transactions.length };
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw error;
  }
};

/**
 * Export user data to CSV file
 */
export const exportToCSV = async (userId) => {
  try {
    const transactions = await getTransactions(userId);

    if (transactions.length === 0) {
      throw new Error('No transactions to export');
    }

    // CSV headers
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description', 'Created At'];
    
    // CSV rows
    const rows = transactions.map(t => [
      t.date || '',
      t.type || '',
      t.category || '',
      t.amount || 0,
      `"${(t.description || '').replace(/"/g, '""')}"`, // Escape quotes
      t.createdAt?.toDate?.()?.toISOString() || ''
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, count: transactions.length };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

/**
 * Export user data to Excel (XLSX) format
 * This creates a simple tab-separated file that Excel can open
 */
export const exportToExcel = async (userId) => {
  try {
    const transactions = await getTransactions(userId);

    if (transactions.length === 0) {
      throw new Error('No transactions to export');
    }

    // Excel headers
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description', 'Created At'];
    
    // Excel rows
    const rows = transactions.map(t => [
      t.date || '',
      t.type || '',
      t.category || '',
      t.amount || 0,
      (t.description || '').replace(/\t/g, ' '), // Remove tabs
      t.createdAt?.toDate?.()?.toISOString() || ''
    ]);

    // Combine with tabs
    const excelContent = [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n');

    // Create and download Excel file
    const blob = new Blob([excelContent], { 
      type: 'application/vnd.ms-excel;charset=utf-8;' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-transactions-${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, count: transactions.length };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};