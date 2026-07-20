import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser as apiRegister, loginUser as apiLogin, getToken, setToken, removeToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ─── Decode a JWT payload (no verification — server handles that) ──────────────
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Rehydrate session from stored token on mount ────────────────────────────
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        // Token is still valid — restore session from token payload
        setCurrentUser({
          id: decoded.id,
          isAdmin: decoded.isAdmin,
        });
      } else {
        // Token expired — clear it
        removeToken();
      }
    }
    setLoading(false);
  }, []);

  // ── Sign up — calls the real backend API ────────────────────────────────────
  const signup = async (name, email, password, confirmPassword, agreeTerms) => {
    const data = await apiRegister({ name, email, password, confirmPassword, agreeTerms });
    // Store token but don't auto-login (redirect to sign in)
    setToken(data.token);
    return data;
  };

  // ── Sign in — calls the real backend API ────────────────────────────────────
  const login = async (email, password) => {
    const data = await apiLogin({ email, password });
    setToken(data.token);
    setCurrentUser({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      isAdmin: data.user.isAdmin,
    });
    return data;
  };

  // ── Log out ─────────────────────────────────────────────────────────────────
  const logout = () => {
    removeToken();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
