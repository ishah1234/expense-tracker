# TrackWise Expense Tracker

A single-page expense tracking application built with React that allows users to manage their personal finances by adding, viewing, editing, and deleting expenses.

## Features

- Add, edit, and delete expenses
- Categorize expenses (Food & Groceries, Travel, Shopping, Entertainment, Utilities, Rent, Education, Other)
- Filter expenses by category
- Search expenses by title or description
- Sort expenses by date or amount
- Date range analytics (This Week, This Month, Last 30 Days, and Custom Range)
- Real-time summary statistics (total spending, highest expense, average per expense, total count)
- Spending breakdown by category with visual progress bars
- Monthly budget goals (total and category-wise)
- Budget alert states when spending crosses 80% (warning) and 100% (over budget)
- Spending trend chart based on the active filtered date range
- Form validation (title is mandatory, amount must be a whole number, date is required)

## Tech Stack

- React
- React Hooks (useState, useReducer, useMemo)
- JavaScript
- HTML & CSS
- Vite

## Run Locally

1. Clone the repository:

```bash
git clone https://github.com/ishah1234/expense-tracker
```

2. Move into the project folder:

```bash
cd expense-tracker
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL shown in your terminal (usually http://localhost:5173).

## Live Demo

[Click here to view it](https://projecttrackwise.vercel.app/)
