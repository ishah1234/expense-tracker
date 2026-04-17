export default function Summary({ expenses }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const highest = expenses.length
    ? Math.max(...expenses.map((e) => e.amount))
    : 0;
  const avg = expenses.length ? Math.round(total / expenses.length) : 0;

  return (
    <div className="summary-grid">
      <StatCard label="Total Spending" value={`$${total.toLocaleString()}`} />
      <StatCard
        label="Highest Expense"
        value={`$${highest.toLocaleString()}`}
      />
      <StatCard label="Avg per Expense" value={`$${avg.toLocaleString()}`} />
      <StatCard label="Total Count" value={expenses.length} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
