import { createContext, useState, useContext, useEffect } from "react";

export const LoginContext = createContext();

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (user) setUser(JSON.parse(user));
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        setUser,
        user,
        loading,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  return useContext(LoginContext);
}

// Optional helper
export function Get_Token() {
  return localStorage.getItem("token");
}
