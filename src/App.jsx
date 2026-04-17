import { useReducer, useState, useMemo } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/List";
import Summary from "./components/summary";
import CategoryChart from "./components/categories";
import BudgetAlerts from "./components/BudgetAlerts";
import TrendChart from "./components/TrendChart";
import Popup from "./components/popup";
import "./App.css";

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { ...action.payload, id: Date.now() }];
    case "UPDATE":
      return state.map((e) =>
        e.id === action.payload.id ? action.payload : e,
      );
    case "DELETE":
      return state.filter((e) => e.id !== action.id);
    default:
      return state;
  }
}

const CATEGORIES = [
  "Food and Groceries",
  "Travel",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Rent",
  "Education",
  "Other",
];

export default function App() {
  const [expenses, dispatch] = useReducer(reducer, []);
  const [popup, setPopup] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("this_month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState({});

  const dateRangeFiltered = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return expenses.filter((expense) => {
      const expenseDate = new Date(`${expense.date}T00:00:00`);
      if (Number.isNaN(expenseDate.getTime())) return false;

      if (dateRange === "this_month") {
        return (
          expenseDate.getFullYear() === today.getFullYear() &&
          expenseDate.getMonth() === today.getMonth()
        );
      }

      if (dateRange === "this_week") {
        const day = today.getDay();
        const mondayOffset = day === 0 ? -6 : 1 - day;
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() + mondayOffset);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return expenseDate >= weekStart && expenseDate <= weekEnd;
      }

      if (dateRange === "last_30_days") {
        const start = new Date(today);
        start.setDate(today.getDate() - 29);
        return expenseDate >= start && expenseDate <= today;
      }

      if (dateRange === "custom") {
        const fromDate = customFrom ? new Date(`${customFrom}T00:00:00`) : null;
        const toDate = customTo ? new Date(`${customTo}T00:00:00`) : null;

        if (fromDate && Number.isNaN(fromDate.getTime())) return false;
        if (toDate && Number.isNaN(toDate.getTime())) return false;

        if (fromDate && toDate) {
          return expenseDate >= fromDate && expenseDate <= toDate;
        }
        if (fromDate) return expenseDate >= fromDate;
        if (toDate) return expenseDate <= toDate;
        return true;
      }

      return true;
    });
  }, [expenses, dateRange, customFrom, customTo]);

  const filtered = useMemo(() => {
    let list = dateRangeFiltered.filter((e) => {
      const matchCat =
        filterCategory === "All" || e.category === filterCategory;
      const matchSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
    return [...list].sort((a, b) => {
      if (sortBy === "date_desc") return b.date.localeCompare(a.date);
      if (sortBy === "date_asc") return a.date.localeCompare(b.date);
      if (sortBy === "amount_desc") return b.amount - a.amount;
      if (sortBy === "amount_asc") return a.amount - b.amount;
      return 0;
    });
  }, [dateRangeFiltered, filterCategory, search, sortBy]);

  const monthlyExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter((expense) => {
      const expenseDate = new Date(`${expense.date}T00:00:00`);
      return (
        !Number.isNaN(expenseDate.getTime()) &&
        expenseDate.getFullYear() === now.getFullYear() &&
        expenseDate.getMonth() === now.getMonth()
      );
    });
  }, [expenses]);

  const monthlyTotalSpend = useMemo(
    () => monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [monthlyExpenses],
  );

  const monthlyCategorySpend = useMemo(() => {
    return monthlyExpenses.reduce((map, expense) => {
      map[expense.category] = (map[expense.category] || 0) + expense.amount;
      return map;
    }, {});
  }, [monthlyExpenses]);

  function handleAdd(payload) {
    dispatch({ type: "ADD", payload });
    setPopup(null);
  }

  function handleUpdate(payload) {
    dispatch({ type: "UPDATE", payload });
    setPopup(null);
  }

  function handleDelete(id) {
    dispatch({ type: "DELETE", id });
    setDeleteConfirm(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>TrackWise</h1>
          <p className="subtitle">{expenses.length} expenses total</p>
        </div>
        <button
          className="btn btn-primary app-add-btn"
          onClick={() => setPopup("add")}
        >
          + Add Expense
        </button>
      </header>

      <Summary expenses={filtered} />

      <div className="toolbar">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="custom">Custom Range</option>
        </select>
        {dateRange === "custom" && (
          <>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              aria-label="Custom range start date"
            />
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              aria-label="Custom range end date"
            />
          </>
        )}
        <input
          className="search-input"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">Highest Amount</option>
          <option value="amount_asc">Lowest Amount</option>
        </select>
      </div>

      <ExpenseList
        expenses={filtered}
        onEdit={(expense) => setPopup({ type: "edit", expense })}
        onDelete={(id) => setDeleteConfirm(id)}
      />

      <BudgetAlerts
        categories={CATEGORIES}
        monthlyTotalSpend={monthlyTotalSpend}
        monthlyCategorySpend={monthlyCategorySpend}
        totalMonthlyBudget={totalMonthlyBudget}
        setTotalMonthlyBudget={setTotalMonthlyBudget}
        categoryBudgets={categoryBudgets}
        setCategoryBudgets={setCategoryBudgets}
      />

      <TrendChart expenses={filtered} />

      <CategoryChart expenses={filtered} />

      {popup === "add" && (
        <Popup title="Add Expense" onClose={() => setPopup(null)}>
          <ExpenseForm onSave={handleAdd} onCancel={() => setPopup(null)} />
        </Popup>
      )}

      {popup?.type === "edit" && (
        <Popup title="Edit Expense" onClose={() => setPopup(null)}>
          <ExpenseForm
            initial={popup.expense}
            onSave={(data) => handleUpdate({ ...data, id: popup.expense.id })}
            onCancel={() => setPopup(null)}
          />
        </Popup>
      )}

      {deleteConfirm && (
        <Popup title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
          <p>
            Are you sure you want to delete this expense? This cannot be undone.
          </p>
          <div className="form-actions" style={{ marginTop: "1rem" }}>
            <button className="btn" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(deleteConfirm)}
            >
              Yes, Delete
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
}
