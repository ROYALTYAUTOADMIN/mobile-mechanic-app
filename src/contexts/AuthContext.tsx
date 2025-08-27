import React, { createContext, useContext, useState } from 'react';

interface User {
  id: number;
  username: string;
  role: 'customer' | 'mechanic' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string, role: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
};
