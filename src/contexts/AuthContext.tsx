import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: number;
  username: string;
  role: 'customer' | 'mechanic' | 'admin';
  is_banned?: boolean;
  is_approved?: boolean;
  ban_message?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, role: User['role']) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string, role: User['role']) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        return true;
      } else {
        throw data;
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
