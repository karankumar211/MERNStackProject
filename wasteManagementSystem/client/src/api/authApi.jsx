import axios from "axios";

// 1. Use Environment Variables for the Base URL
// This ensures it works in both development and production
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

/**
 * Register a new user
 */
export const register = async (userData) => {
  try {
    // Destructuring userData in the argument makes the function cleaner
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    // Standardizing the error message for the UI
    const message = error.response?.data?.message || "Registration failed";
    throw new Error(message);
  }
};

/**
 * Login user and manage token
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    
    // 2. Critical: If the backend returns a token, save it!
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Invalid credentials";
    throw new Error(message);
  }
};

/**
 * Logout utility
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login"; 
};