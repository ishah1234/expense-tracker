import { CATEGORIES } from './ExpenseForm';

function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = CATEGORIES.reduce((acc, cat) => {
    const catTotal = expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    if (catTotal > 0) acc.push({ category: cat, total: catTotal });
    return acc;
  }, []);

  return (
    <section className="summary-card" aria-label="Expense summary">
      <div className="summary-total">
        <span className="summary-label">Total Spending</span>
        <span className="summary-amount">${total.toLocaleString()}</span>
      </div>

      {byCategory.length > 0 && (
        <div className="summary-breakdown">
          {byCategory.map(({ category, total: catTotal }) => {
            const pct = total > 0 ? Math.round((catTotal / total) * 100) : 0;
            return (
              <div key={category} className="breakdown-item">
                <span className="breakdown-label">{category}</span>
                <div className="breakdown-bar-wrapper">
                  <div
                    className="breakdown-bar"
                    style={{ width: `${pct}%` }}
                    aria-label={`${category}: ${pct}%`}
                  />
                </div>
                <span className="breakdown-value">${catTotal.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="summary-count">
        {expenses.length} expense{expenses.length !== 1 ? 's' : ''} recorded
      </div>
    </section>
  );
}

export default ExpenseSummary;
