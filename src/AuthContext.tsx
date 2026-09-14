import React, { createContext, useContext, useEffect, useState } from "react";

interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: "employer" | "candidate" | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  setRole: (role: "employer" | "candidate") => Promise<void>;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  setRole: async () => {},
  login: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = () => {
    const newUser: AppUser = {
      uid: "mock-user-123",
      email: "demo@example.com",
      displayName: "Demo User",
      role: null
    };
    localStorage.setItem("mock_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("mock_user");
    setUser(null);
  };

  const setRole = async (role: "employer" | "candidate") => {
    if (user) {
      const updatedUser = { ...user, role };
      localStorage.setItem("mock_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
