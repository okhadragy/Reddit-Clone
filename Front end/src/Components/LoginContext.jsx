import { createContext, useState, useContext, useEffect } from "react";

export const LoginContext = createContext();

// AppProvider provides login state and setter
export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
}

// Custom hook to use authentication context
export function useAuth() {
  return useContext(LoginContext);
}

// Function to get the token and update login status
export function Get_Token() {
  const token = localStorage.getItem("token");
  return token ? token : null;
}
