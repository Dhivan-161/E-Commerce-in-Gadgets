// ─── Base URL ─────────────────────────────────────────────────────────────────
// In development, Vite proxies /api → http://localhost:5000
// In production, set VITE_API_URL in your env
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('gadgethub_token');
export const setToken = (token) => localStorage.setItem('gadgethub_token', token);
export const removeToken = () => localStorage.removeItem('gadgethub_token');

// ─── Core fetch helper ────────────────────────────────────────────────────────
export const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (e) {
      data = { message: 'Invalid JSON response from server' };
    }
  } else {
    try {
      const text = await response.text();
      data = { message: text || `HTTP error ${response.status}` };
    } catch (e) {
      data = { message: `HTTP error ${response.status}` };
    }
  }

  if (!response.ok) {
    // Throw the server's error message so UI can display it
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

/**
 * Check backend health status (database connectivity)
 */
export const getHealth = () => request('/health');


// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string, confirmPassword: string, agreeTerms: boolean }} data
 */
export const registerUser = (data) =>
  request('/users/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * Log in an existing user.
 * @param {{ email: string, password: string }} data
 */
export const loginUser = (data) =>
  request('/users/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * Get the current user's profile (requires auth token).
 */
export const getUserProfile = () => request('/users/profile');

/**
 * Update the current user's profile.
 * @param {{ name?: string, email?: string, password?: string, profileImage?: string }} data
 */
export const updateUserProfile = (data) =>
  request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

/**
 * Upload an image file.
 * @param {File} file
 */
export const uploadImage = async (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Image upload failed');
  }

  return response.text();
};

// ─── Products API ─────────────────────────────────────────────────────────────
export const getProducts = () => request('/products');
export const getProductById = (id) => request(`/products/${id}`);
export const createProduct = (data) =>
  request('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateProduct = (id, data) =>
  request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteProduct = (id) =>
  request(`/products/${id}`, {
    method: 'DELETE',
  });

// ─── Orders API ───────────────────────────────────────────────────────────────
export const createOrder = (data) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const getOrders = () => request('/orders');
export const getUserOrders = () => request('/orders/myorders');

// ─── Users API ────────────────────────────────────────────────────────────────
export const getUsers = () => request('/users');

// ─── Admin API ────────────────────────────────────────────────────────────────
export const getDashboardData = () => request('/admin/dashboard');

// ─── Chatbot API (Gemini AI) ──────────────────────────────────────────────────
export const sendChatbotMessage = (message, products) =>
  request('/chatbot/chat', {
    method: 'POST',
    body: JSON.stringify({ message, products }),
  });
