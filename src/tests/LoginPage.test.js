// src/tests/LoginPage.test.js
import { render, screen } from '@testing-library/react';
import LoginPage from '../LoginPage';

test('renders login page', () => {
  render(<LoginPage />);
  const linkElement = screen.getByText(/login/i);
  expect(linkElement).toBeInTheDocument();
});
