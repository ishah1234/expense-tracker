const CAT_COLORS = {
  "Food and Groceries": "#1D9E75",
  Travel: "#378ADD",
  Shopping: "#D4537E",
  Entertainment: "#7F77DD",
  Utilities: "#BA7517",
  Rent: "#E24B4A",
  Education: "#D85A30",
  Other: "#888780",
};

export default function CategoryChart({ expenses }) {
  const grandTotal = expenses.reduce((s, e) => s + e.amount, 0);

  const map = {};
  expenses.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.amount;
  });

  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: "1.5rem" }}>
      <h2 className="section-title">Spending by Category</h2>
      {sorted.map(([cat, amt]) => {
        const pct = grandTotal ? Math.round((amt / grandTotal) * 100) : 0;
        return (
          <div key={cat} className="bar-row">
            <div className="bar-label">
              <span>{cat}</span>
              <span>
                ${amt.toLocaleString()} ({pct}%)
              </span>
            </div>
            <div className="bar-bg">
              <div
                className="bar-fill"
                style={{
                  width: `${pct}%`,
                  background: CAT_COLORS[cat] || "#888",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
