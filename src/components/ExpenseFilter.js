import { CATEGORIES } from './ExpenseForm';

function ExpenseFilter({ filterCategory, onFilterChange }) {
  const allOptions = ['All', ...CATEGORIES];

  return (
    <div className="filter-container" role="search" aria-label="Filter expenses by category">
      <label htmlFor="filter-category" className="filter-label">
        Filter by Category:
      </label>
      <select
        id="filter-category"
        className="form-control filter-select"
        value={filterCategory}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        {allOptions.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ExpenseFilter;
