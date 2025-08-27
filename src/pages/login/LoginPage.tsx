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
      if (!success) {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      if (err?.banned) setError('Account banned');
      else if (err?.pending_approval) setError('Awaiting approval');
      else setError('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded w-80">
        <h1 className="text-xl mb-4 font-bold text-cent
