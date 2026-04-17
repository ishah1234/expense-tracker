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

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        No expenses yet. Click "+ Add Expense" to get started!
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div key={expense.id} className="expense-card">
          <div
            className="cat-dot"
            style={{ background: CAT_COLORS[expense.category] || "#888" }}
          />
          <div className="expense-info">
            <div className="expense-title">{expense.title}</div>
            <div className="expense-meta">
              <span
                className="cat-badge"
                style={{
                  background: (CAT_COLORS[expense.category] || "#888") + "22",
                  color: CAT_COLORS[expense.category] || "#888",
                }}
              >
                {expense.category}
              </span>
              {expense.description && <span>{expense.description}</span>}
              <span>{expense.date}</span>
            </div>
          </div>
          <div className="expense-amount">
            ${expense.amount.toLocaleString()}
          </div>
          <div className="expense-actions">
            <button className="btn btn-sm" onClick={() => onEdit(expense)}>
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(expense.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
