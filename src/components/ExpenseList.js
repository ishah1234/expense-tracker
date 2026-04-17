import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📭</span>
        <p>No expenses found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <ul className="expense-list" aria-label="Expense list">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default ExpenseList;
