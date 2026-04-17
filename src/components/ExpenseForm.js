import { useState, useEffect } from 'react';

export const CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Utilities',
  'Other',
];

const EMPTY_FORM = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  amount: '',
  date: new Date().toISOString().split('T')[0],
};

function ExpenseForm({ onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description || '',
        category: initialData.category,
        amount: String(initialData.amount),
        date: initialData.date,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (form.title.trim().length > 100) {
      newErrors.title = 'Title must be 100 characters or fewer.';
    }

    if (form.amount === '' || form.amount === null) {
      newErrors.amount = 'Amount is required.';
    } else if (!/^\d+$/.test(form.amount.toString().trim())) {
      newErrors.amount = 'Amount must be a positive integer.';
    } else if (parseInt(form.amount, 10) <= 0) {
      newErrors.amount = 'Amount must be greater than zero.';
    }

    if (!form.date) {
      newErrors.date = 'Date is required.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const expense = {
      ...(initialData ? { id: initialData.id } : {}),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      amount: parseInt(form.amount, 10),
      date: form.date,
    };

    onSubmit(expense);
  };

  const isEditing = Boolean(initialData);

  return (
    <div className="form-card">
      <h2 className="form-title">{isEditing ? 'Edit Expense' : 'Add New Expense'}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className={`form-control${errors.title ? ' is-invalid' : ''}`}
              placeholder="e.g. Grocery run"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
            />
            {errors.title && <span className="error-msg">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount ($) <span className="required">*</span>
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="1"
              step="1"
              className={`form-control${errors.amount ? ' is-invalid' : ''}`}
              placeholder="e.g. 50"
              value={form.amount}
              onChange={handleChange}
            />
            {errors.amount && <span className="error-msg">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date <span className="required">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              className={`form-control${errors.date ? ' is-invalid' : ''}`}
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <span className="error-msg">{errors.date}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Optional details about this expense"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Save Changes' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
