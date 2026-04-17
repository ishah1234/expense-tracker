function getBudgetStatus(spend, budgetValue) {
  const budget = Number(budgetValue);
  if (!budget || budget <= 0) {
    return { level: "none", percent: 0, text: "No budget set" };
  }

  const percent = (spend / budget) * 100;

  if (percent >= 100) {
    return {
      level: "danger",
      percent,
      text: `Over budget by $${Math.max(0, spend - budget).toLocaleString()}`,
    };
  }

  if (percent >= 80) {
    return {
      level: "warning",
      percent,
      text: "Near budget limit (80%+)",
    };
  }

  return {
    level: "ok",
    percent,
    text: "Within budget",
  };
}

function BudgetRow({ label, spend, budget, onBudgetChange }) {
  const status = getBudgetStatus(spend, budget);
  const hasBudget = Number(budget) > 0;

  return (
    <div className="budget-row">
      <div className="budget-row-main">
        <div>
          <div className="budget-label">{label}</div>
          <div className="budget-meta">
            Spent: ${spend.toLocaleString()}
            {hasBudget ? ` / $${Number(budget).toLocaleString()}` : ""}
          </div>
        </div>
        <input
          className="budget-input"
          type="number"
          min="0"
          placeholder="Set budget"
          value={budget}
          onChange={(e) => onBudgetChange(e.target.value)}
        />
      </div>

      <div className="budget-progress-bg">
        <div
          className={`budget-progress-fill ${status.level}`}
          style={{ width: `${Math.min(status.percent, 100)}%` }}
        />
      </div>

      <div className={`budget-status ${status.level}`}>{status.text}</div>
    </div>
  );
}

export default function BudgetAlerts({
  categories,
  monthlyTotalSpend,
  monthlyCategorySpend,
  totalMonthlyBudget,
  setTotalMonthlyBudget,
  categoryBudgets,
  setCategoryBudgets,
}) {
  const monthLabel = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="card" style={{ marginTop: "1.5rem" }}>
      <h2 className="section-title">Monthly Budget Goals</h2>
      <p className="budget-caption">
        Alerts based on spending in {monthLabel}.
      </p>

      <BudgetRow
        label="Total Monthly Budget"
        spend={monthlyTotalSpend}
        budget={totalMonthlyBudget}
        onBudgetChange={setTotalMonthlyBudget}
      />

      <div className="budget-divider" />

      {categories.map((category) => (
        <BudgetRow
          key={category}
          label={category}
          spend={monthlyCategorySpend[category] || 0}
          budget={categoryBudgets[category] || ""}
          onBudgetChange={(value) =>
            setCategoryBudgets((prev) => ({ ...prev, [category]: value }))
          }
        />
      ))}
    </div>
  );
}
