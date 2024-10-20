import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number; // Add other fields as necessary based on your JWT
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decoded.exp < currentTime;
  } catch (e) {
    return true; // Token is invalid or expired
  }
};

// Usage
