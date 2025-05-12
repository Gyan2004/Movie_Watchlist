import React, { createContext, useState, useContext, useEffect } from 'react';

// Initial users for demo
const initialUsers = {
  'demo': { password: 'password', watchlist: new Set() },
};

// Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('currentUser') !== null;
  });

  // Save users to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Register a new user
  const register = (username, password) => {
    if (users[username]) {
      return false; // Username already exists
    }

    const newUsers = {
      ...users,
      [username]: { password, watchlist: [] }
    };
    
    setUsers(newUsers);
    return true; // Registration successful
  };

  // Login user
  const login = (username, password) => {
    if (users[username] && users[username].password === password) {
      setCurrentUser({ username });
      setIsAuthenticated(true);
      return true; // Login successful
    }
    return false; // Login failed
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Add movie to watchlist
  const addToWatchlist = (movieId) => {
    if (!currentUser) return;
    
    const username = currentUser.username;
    const userWatchlist = users[username].watchlist || [];
    
    if (!userWatchlist.includes(movieId)) {
      const updatedWatchlist = [...userWatchlist, movieId];
      
      setUsers({
        ...users,
        [username]: {
          ...users[username],
          watchlist: updatedWatchlist
        }
      });
    }
  };

  // Remove movie from watchlist
  const removeFromWatchlist = (movieId) => {
    if (!currentUser) return;
    
    const username = currentUser.username;
    const userWatchlist = users[username].watchlist || [];
    
    const updatedWatchlist = userWatchlist.filter(id => id !== movieId);
    
    setUsers({
      ...users,
      [username]: {
        ...users[username],
        watchlist: updatedWatchlist
      }
    });
  };

  // Get user's watchlist
  const getWatchlist = () => {
    if (!currentUser) return [];
    const username = currentUser.username;
    return users[username].watchlist || [];
  };

  // Check if a movie is in watchlist
  const isInWatchlist = (movieId) => {
    if (!currentUser) return false;
    const username = currentUser.username;
    const userWatchlist = users[username].watchlist || [];
    return userWatchlist.includes(movieId);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      register,
      login,
      logout,
      addToWatchlist,
      removeFromWatchlist,
      getWatchlist,
      isInWatchlist
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 