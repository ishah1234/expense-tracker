import { useState } from "react";

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

const EMPTY = {
  title: "",
  description: "",
  category: "Food and Groceries",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
};

function validate(form) {
  const errors = {};
  if (!form.title.trim()) {
    errors.title = "Title is required.";
  } else if (form.title.trim().length < 2) {
    errors.title = "Title must be at least 2 characters.";
  }
  if (form.amount === "") {
    errors.amount = "Amount is required.";
  } else if (!/^\d+$/.test(String(form.amount))) {
    errors.amount = "Amount must be a whole number (no decimals).";
  } else if (parseInt(form.amount) <= 0) {
    errors.amount = "Amount must be greater than 0.";
  }
  if (!form.date) {
    errors.date = "Date is required.";
  }
  return errors;
}

export default function ExpenseForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function setField(key, value) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (touched[key]) {
      const e = validate(updated);
      setErrors((prev) => ({ ...prev, [key]: e[key] }));
    }
  }

  function handleBlur(key) {
    setTouched((t) => ({ ...t, [key]: true }));
    const e = validate(form);
    setErrors((prev) => ({ ...prev, [key]: e[key] }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate(form);
    setErrors(e2);
    setTouched({ title: true, amount: true, date: true });
    if (Object.keys(e2).length === 0) {
      onSave({ ...form, amount: parseInt(form.amount) });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label>Title *</label>
        <input
          value={form.title}
          placeholder="e.g. Grocery run"
          onChange={(e) => setField("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          className={errors.title ? "input-error" : ""}
        />
        {errors.title && <span className="error-msg">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          value={form.description}
          placeholder="Optional notes"
          onChange={(e) => setField("description", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          value={form.category}
          onChange={(e) => setField("category", e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Amount ($) *</label>
          <input
            value={form.amount}
            placeholder="0"
            inputMode="numeric"
            onChange={(e) => setField("amount", e.target.value)}
            onBlur={() => handleBlur("amount")}
            className={errors.amount ? "input-error" : ""}
          />
          {errors.amount && <span className="error-msg">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setField("date", e.target.value)}
            onBlur={() => handleBlur("date")}
            className={errors.date ? "input-error" : ""}
          />
          {errors.date && <span className="error-msg">{errors.date}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initial ? "Save Changes" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
