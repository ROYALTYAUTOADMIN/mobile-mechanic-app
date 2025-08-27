import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'mechanic' | 'admin'>('customer');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(username, password, role);
      if (!success) setError('Invalid credentials');
    } catch (err: any) {
      if (err?.banned) setError('Account banned');
      else if (err?.pending_approval) setError('Awaiting approval');
      else setError('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded w-80">
        <h1 className="text-xl mb-4 font-bold text-center">Login</h1>

        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'customer' | 'mechanic' | 'admin')}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="customer">Customer</option>
          <option value="mechanic">Mechanic</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
