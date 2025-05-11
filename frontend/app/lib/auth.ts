import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

// Token storage key
const TOKEN_KEY = 'social_media_token';

// Interface for decoded JWT token
interface DecodedToken {
  userId: number;
  username: string;
  exp: number;
  iat: number;
}

// Save token to localStorage (only in browser)
export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// Get token from localStorage (only in browser)
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Remove token from localStorage (only in browser)
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Check if token is valid
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Get user info from token
export const getUserFromToken = (): { userId: number; username: string } | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      userId: decoded.userId,
      username: decoded.username,
    };
  } catch (error) {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return isTokenValid();
};

// Logout user
export const logout = (): void => {
  removeToken();
  // Redirect to login page if we're in the browser
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};
