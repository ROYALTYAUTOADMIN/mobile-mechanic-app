// src/App.tsx
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login/LoginPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MechanicDashboard } from './pages/mechanic/MechanicDashboard';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/customer/*" element={<CustomerDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/mechanic/*" element={<MechanicDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
