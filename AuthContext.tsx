import * as React from 'react';

interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  full_name?: string;
  role: 'customer' | 'mechanic' | 'admin';
  is_banned?: number;
  is_approved?: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: string) => Promise<boolean>;
  register: (username: string, password: string, email: string, phone: string, fullName: string, role: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);

  const login = async (username: string, password: string, role: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.status === 403) {
        if (data.banned) {
          throw { banned: true, message: data.message };
        } else if (data.pending_approval) {
          throw { pending_approval: true, message: data.message };
        }
      }

      if (data.success) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      if (error?.banned || error?.pending_approval) {
        throw error;
      }
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async () => {
    console.log("Register not implemented yet");
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}