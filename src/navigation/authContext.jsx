import { createContext, useContext, useEffect, useState } from "react";
import apiRequest from "../services/api/apiRequest";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    console.log(savedToken)
    if (savedToken) setToken(savedToken);
    setLoading(false);
  }, []);

  const loginAdmin = async (data) => {
    const res = await apiRequest("post", "/admin/login", data);
    localStorage.setItem("token", res.token);
    setToken(res.token);
    return res
  };

  // ✅ REGISTER ADMIN
  const registerAdmin = async (data) => {
    return await apiRequest("post", "/admin/register", data);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        loginAdmin,
        registerAdmin,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
