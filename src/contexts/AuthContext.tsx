// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, getCurrentUser } from "@/lib/api";
import type { User } from "@/types";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load: read token from localStorage and, if exists, call /auth/me
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);

    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch((err) => {
        console.error("Failed to fetch current user:", err);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await loginRequest(username, password); // { token, user }

      // user already matches our User type (id, username, role)
      const loggedInUser: User = data.user;

      // Save ONLY token
      localStorage.setItem("token", data.token);

      setToken(data.token);
      setUser(loggedInUser);
      return true;
    } catch (error) {
      console.error("LOGIN FAILED:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

   return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
