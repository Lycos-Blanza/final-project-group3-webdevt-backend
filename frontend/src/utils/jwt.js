// src/utils/jwt.js
export const generateToken = (user) => {
  // No longer used – backend generates real JWT
  return null;
};

export const verifyToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};