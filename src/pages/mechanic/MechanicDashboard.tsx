import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function MechanicDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Mechanic Dashboard</h1>
      <p className="mt-2">Hi {user?.username}, welcome to your mechanic panel.</p>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
