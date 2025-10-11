import { createSlice } from '@reduxjs/toolkit';

/**
 * Initialize state from localStorage if available
 * This ensures the user stays logged in after page refresh
 */
const getInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        isAuthenticated: true,
        user,
        token,
        loading: false,
      };
    }
  } catch (error) {
    console.error('Failed to restore auth state from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  // Default state if no valid session found
  return {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(), // Use dynamic initial state instead of static
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user || action.payload; // Support both formats
      state.token = action.payload.token;
      state.loading = false;
      
      // Persist to localStorage
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      localStorage.setItem('user', JSON.stringify(action.payload.user || action.payload));
    },
    setCredentials: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      
      // Persist to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { loginSuccess, setCredentials, logout, updateProfile, setLoading } = authSlice.actions;
export default authSlice.reducer;
