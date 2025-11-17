// src/utils/jwt.js
const SECRET = "diner28-super-secret-key-2025";

export const generateToken = (user) => {
  const payload = { email: user.email, role: user.role };
  return btoa(JSON.stringify(payload)); // Simple base64 (demo only)
};

export const verifyToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};