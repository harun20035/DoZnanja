// utils/auth.js
import { jwtDecode } from "jwt-decode";

// Helper funkcija za siguran pristup localStorage
const getLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const getRoleFromToken = () => {
  const token = getLocalStorage("auth_token");
  console.log("Token from localStorage:", token);
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
};

// Dodatna funkcija za dobijanje korisničkih podataka
export const getUserDataFromToken = () => {
  const token = getLocalStorage("auth_token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      sub: decoded.sub,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    };
  } catch (e) {
    console.error("Error decoding user data:", e);
    return null;
  }
};