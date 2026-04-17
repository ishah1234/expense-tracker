import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the app title', () => {
  render(<App />);
  expect(screen.getByText(/Expense Tracker/i)).toBeInTheDocument();
});

test('shows Add Expense button and opens form on click', () => {
  render(<App />);
  const addBtn = screen.getByRole('button', { name: /add expense/i });
  fireEvent.click(addBtn);
  expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
});

test('shows validation error when submitting empty title', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  // clear title and submit
  const titleInput = screen.getByLabelText(/title/i);
  fireEvent.change(titleInput, { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  expect(screen.getByText(/title is required/i)).toBeInTheDocument();
});

test('shows validation error for non-integer amount', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  const titleInput = screen.getByLabelText(/title/i);
  fireEvent.change(titleInput, { target: { value: 'Test' } });
  const amountInput = screen.getByLabelText(/amount/i);
  fireEvent.change(amountInput, { target: { value: '10.5' } });
  fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  expect(screen.getByText(/must be a positive integer/i)).toBeInTheDocument();
});

test('adds a new expense and displays it in the list', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Coffee' } });
  fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '5' } });
  fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  expect(screen.getByText('Coffee')).toBeInTheDocument();
});

test('filter by category shows only matching expenses', () => {
  render(<App />);
  const filterSelect = screen.getByLabelText(/filter by category/i);
  fireEvent.change(filterSelect, { target: { value: 'Food' } });
  expect(screen.getByText('Groceries')).toBeInTheDocument();
  expect(screen.queryByText('Bus Pass')).not.toBeInTheDocument();
});

