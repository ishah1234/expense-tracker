import { useState, useCallback } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseFilter from './components/ExpenseFilter';

const INITIAL_EXPENSES = [
  {
    id: 1,
    title: 'Groceries',
    description: 'Weekly grocery shopping',
    category: 'Food',
    amount: 85,
    date: '2026-04-10',
  },
  {
    id: 2,
    title: 'Bus Pass',
    description: 'Monthly transit pass',
    category: 'Transportation',
    amount: 120,
    date: '2026-04-01',
  },
  {
    id: 3,
    title: 'Netflix',
    description: 'Monthly subscription',
    category: 'Entertainment',
    amount: 15,
    date: '2026-04-05',
  },
];

function App() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const handleAddExpense = useCallback((expense) => {
    setExpenses((prev) => [
      ...prev,
      { ...expense, id: Date.now() },
    ]);
    setShowForm(false);
  }, []);

  const handleEditExpense = useCallback((updatedExpense) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
    );
    setEditingExpense(null);
    setShowForm(false);
  }, []);

  const handleDeleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleStartEdit = useCallback((expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  }, []);

  const handleCancelForm = useCallback(() => {
    setEditingExpense(null);
    setShowForm(false);
  }, []);

  const handleOpenAddForm = useCallback(() => {
    setEditingExpense(null);
    setShowForm(true);
  }, []);

  const filteredExpenses =
    filterCategory === 'All'
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">💰</span> Expense Tracker
          </h1>
          {!showForm && (
            <button className="btn btn-primary add-btn" onClick={handleOpenAddForm}>
              + Add Expense
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        <ExpenseSummary expenses={expenses} />

        {showForm && (
          <ExpenseForm
            onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
            onCancel={handleCancelForm}
            initialData={editingExpense}
          />
        )}

        <section className="expense-section">
          <div className="section-header">
            <h2 className="section-title">Expenses</h2>
            <ExpenseFilter
              filterCategory={filterCategory}
              onFilterChange={setFilterCategory}
            />
          </div>

          <ExpenseList
            expenses={filteredExpenses}
            onEdit={handleStartEdit}
            onDelete={handleDeleteExpense}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
