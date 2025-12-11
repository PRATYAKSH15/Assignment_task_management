import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ must match exported name

export function useAuth() {
  return useContext(AuthContext);
}
