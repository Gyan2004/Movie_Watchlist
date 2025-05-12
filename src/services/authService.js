import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register a new user
export const register = async (username, password) => {
  try {
    const response = await api.post('/users/register', { username, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

// Login a user
export const login = async (username, password) => {
  try {
    const response = await api.post('/users/login', { username, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

// Logout a user
export const logout = () => {
  localStorage.removeItem('token');
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/auth');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get user data';
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Get user's watchlist
export const getWatchlist = async () => {
  try {
    const response = await api.get('/users/watchlist');
    return response.data.watchlist;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get watchlist';
  }
};

// Add movie to watchlist
export const addToWatchlist = async (movieId) => {
  try {
    const response = await api.post('/users/watchlist/add', { movieId });
    return response.data.watchlist;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add movie to watchlist';
  }
};

// Remove movie from watchlist
export const removeFromWatchlist = async (movieId) => {
  try {
    const response = await api.post('/users/watchlist/remove', { movieId });
    return response.data.watchlist;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to remove movie from watchlist';
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
}; 