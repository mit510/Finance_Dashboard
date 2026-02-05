// Group transactions by date
export const buildLineChartData = (transactions) => {
  const map = {};

  transactions.forEach(t => {
    const date = new Date(t.createdAt?.seconds * 1000)
      .toLocaleDateString();

    if (!map[date]) {
      map[date] = { date, income: 0, expense: 0 };
    }

    if (t.type === "income") {
      map[date].income += Number(t.amount);
    } else {
      map[date].expense += Number(t.amount);
    }
  });

  return Object.values(map);
};

// Monthly bar chart
export const buildBarChartData = (transactions) => {
  const map = {};

  transactions.forEach(t => {
    const month = new Date(t.createdAt?.seconds * 1000)
      .toLocaleString("default", { month: "short", year: "numeric" });

    if (!map[month]) {
      map[month] = { month, total: 0 };
    }

    map[month].total += Number(t.amount);
  });

  return Object.values(map);
};

// Pie chart (expense categories)
export const buildPieChartData = (transactions) => {
  const map = {};

  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      if (!map[t.category]) {
        map[t.category] = 0;
      }
      map[t.category] += Number(t.amount);
    });

  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
  }));
};
