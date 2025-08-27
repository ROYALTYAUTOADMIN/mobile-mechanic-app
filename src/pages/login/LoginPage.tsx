import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'mechanic' | 'admin'>('customer');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password, role);
    if (!success) setError('Login failed');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded w-80">
        <h1 className="text-xl mb-4 font-bold text-center">Login</h1>
        <input className="w-full mb-2 p-2 border" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="w-full mb-2 p-2 border" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <select className="w-full mb-2 p-2 border" value={role} onChange={e => setRole(e.target.value as any)}>
          <option value="customer">Customer</option>
          <option value="mechanic">Mechanic</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full p-2 bg-red-600 text-white rounded" type="submit">Login</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
