import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../pages/Login';

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: (state = {}) => state,
    },
  });
};

const renderWithProviders = (component) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Login Component', () => {
  it('should render login form', () => {
    renderWithProviders(<Login />);
    // Changed from "Sign In" to "Login" to match actual button text
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
  });

  it('should have email and password inputs', () => {
    renderWithProviders(<Login />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('should validate email format', () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/Email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('should have login button', () => {
    renderWithProviders(<Login />);
    // Changed from "Sign In" to "Login" to match actual button text
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });
});
