import { useReducer, useState, useMemo } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/List";
import Summary from "./components/summary";
import CategoryChart from "./components/categories";
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

  const filtered = useMemo(() => {
    let list = expenses.filter((e) => {
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
  }, [expenses, filterCategory, search, sortBy]);

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
        <div>
          <h1>Expense Tracker</h1>
          <p className="subtitle">{expenses.length} expenses total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setPopup("add")}>
          + Add Expense
        </button>
      </header>

      <Summary expenses={filtered} />

      <div className="toolbar">
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

      <CategoryChart expenses={expenses} />

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
