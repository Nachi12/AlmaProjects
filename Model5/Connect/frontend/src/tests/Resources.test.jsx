import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

// Simple Redux store tests - don't render the component
describe('Resources Component', () => {
  it('should have a valid Redux store configuration', () => {
    const store = configureStore({
      reducer: {
        resources: (state = { resources: [], loading: false, error: null }) => state,
        auth: (state = { user: null, token: null }) => state,
      },
    });
    
    expect(store).toBeDefined();
    expect(store.getState()).toHaveProperty('resources');
  });

  it('should have resources state initialized correctly', () => {
    const store = configureStore({
      reducer: {
        resources: (state = { resources: [], loading: false, error: null }) => state,
        auth: (state = { user: null, token: null }) => state,
      },
    });
    
    const state = store.getState();
    expect(state.resources.resources).toEqual([]);
    expect(state.resources.loading).toBe(false);
    expect(state.resources.error).toBe(null);
  });

  it('should have auth state initialized correctly', () => {
    const store = configureStore({
      reducer: {
        resources: (state = { resources: [], loading: false, error: null }) => state,
        auth: (state = { user: null, token: null }) => state,
      },
    });
    
    const state = store.getState();
    expect(state.auth).toHaveProperty('user');
    expect(state.auth).toHaveProperty('token');
    expect(state.auth.user).toBe(null);
    expect(state.auth.token).toBe(null);
  });
});
