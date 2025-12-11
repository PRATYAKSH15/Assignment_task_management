// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext(); // ✅ export this

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    localStorage.setItem("token", res.data.token);
    setUser({ username });
  };

  const register = async (username, password) => {
    const res = await api.post("/auth/register", { username, password });
    localStorage.setItem("token", res.data.token);
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
