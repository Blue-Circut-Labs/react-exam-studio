import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ExamSession from './pages/ExamSession';
import AdminManagement from './pages/AdminManagement';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard/*" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/exam/:id" 
              element={
                <PrivateRoute>
                  <ExamSession />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <PrivateRoute adminOnly>
                  <AdminManagement />
                </PrivateRoute>
              } 
            />
          </Routes>
          <Toaster position="top-center" richColors />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;