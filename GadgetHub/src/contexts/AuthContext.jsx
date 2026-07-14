import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and load state from localStorage
  useEffect(() => {
    // 1. Ensure a default mock user exists for testing if no users exist
    const savedUsers = localStorage.getItem('gadgethub_users');
    if (!savedUsers) {
      const defaultUsers = [
        { name: 'John Doe', email: 'user@example.com', password: 'password123' }
      ];
      localStorage.setItem('gadgethub_users', JSON.stringify(defaultUsers));
    }

    // 2. Load current session
    const session = localStorage.getItem('gadgethub_session');
    if (session) {
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }
    setLoading(false);
  }, []);

  // Sign up a new user
  const signup = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const savedUsers = JSON.parse(localStorage.getItem('gadgethub_users') || '[]');
          const emailExists = savedUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

          if (emailExists) {
            reject(new Error('An account with this email address already exists.'));
            return;
          }

          const newUser = { name, email, password };
          const updatedUsers = [...savedUsers, newUser];
          localStorage.setItem('gadgethub_users', JSON.stringify(updatedUsers));
          resolve(newUser);
        } catch (error) {
          reject(new Error('Failed to register. Please try again.'));
        }
      }, 1000);
    });
  };

  // Sign in an existing user
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const savedUsers = JSON.parse(localStorage.getItem('gadgethub_users') || '[]');
          const user = savedUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
          );

          if (!user) {
            reject(new Error('Invalid email or password.'));
            return;
          }

          // Exclude password from current session state
          const sessionUser = { name: user.name, email: user.email };
          localStorage.setItem('gadgethub_session', JSON.stringify(sessionUser));
          setCurrentUser(sessionUser);
          resolve(sessionUser);
        } catch (error) {
          reject(new Error('Failed to log in. Please try again.'));
        }
      }, 1000);
    });
  };

  // Log out the user
  const logout = () => {
    localStorage.removeItem('gadgethub_session');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
