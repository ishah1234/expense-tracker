import { useState } from 'react';

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transportation: '#3b82f6',
  Entertainment: '#8b5cf6',
  Shopping: '#ec4899',
  Health: '#10b981',
  Education: '#6366f1',
  Utilities: '#64748b',
  Other: '#94a3b8',
};

function ExpenseItem({ expense, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (showConfirm) {
      onDelete(expense.id);
    } else {
      setShowConfirm(true);
    }
  };

  const handleCancelDelete = () => setShowConfirm(false);

  const categoryColor = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;

  const formattedDate = new Date(expense.date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <li className="expense-item">
      <div
        className="category-badge"
        style={{ backgroundColor: categoryColor }}
        aria-label={`Category: ${expense.category}`}
      >
        {expense.category}
      </div>

      <div className="expense-details">
        <h3 className="expense-title">{expense.title}</h3>
        {expense.description && (
          <p className="expense-description">{expense.description}</p>
        )}
        <span className="expense-date">{formattedDate}</span>
      </div>

      <div className="expense-right">
        <span className="expense-amount">${expense.amount.toLocaleString()}</span>

        <div className="expense-actions">
          {showConfirm ? (
            <div className="confirm-delete" role="alert">
              <span>Delete?</span>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                aria-label="Confirm delete"
              >
                Yes
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleCancelDelete}
                aria-label="Cancel delete"
              >
                No
              </button>
            </div>
          ) : (
            <>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => onEdit(expense)}
                aria-label={`Edit ${expense.title}`}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                aria-label={`Delete ${expense.title}`}
              >
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default ExpenseItem;
