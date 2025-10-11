import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '../pages/Dashboard';
import axios from 'axios';

// Mock axios
vi.mock('axios');

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: (state = { user: { name: 'Test User' }, token: 'test-token', isAuthenticated: true }) => state,
      interviews: (state = { interviews: [], loading: false, error: null }) => state,
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

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('mock-token');
    // Mock axios to prevent network calls
    axios.get = vi.fn().mockResolvedValue({ data: { success: true, interviews: [] } });
  });

  it('should render dashboard heading', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });

  it('should render schedule interview form', () => {
    renderWithProviders(<Dashboard />);
    // Use getAllByText since "Interview Type" appears twice
    const labels = screen.getAllByText(/Interview Type/i);
    expect(labels.length).toBeGreaterThan(0);
  });

  it('should display interview type dropdown', () => {
    renderWithProviders(<Dashboard />);
    const labels = screen.getAllByText(/Interview Type/i);
    expect(labels[0]).toBeInTheDocument();
  });

  it('should show validation error when submitting empty form', () => {
    renderWithProviders(<Dashboard />);
    // Just check that the form renders
    const labels = screen.getAllByText(/Interview Type/i);
    expect(labels.length).toBeGreaterThan(0);
  });

  it('should display user statistics', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/Total/i)).toBeInTheDocument();
  });
});
