import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApprovalQueuePage } from './pages/ApprovalQueuePage';
import { CaseTrackerPage } from './pages/CaseTrackerPage';
import axiosClient from './api/axiosClient';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base font-mono text-xs text-accent-mint">
        Authenticating session...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchApprovalCount = async () => {
        try {
          const res = await axiosClient.get('/cases/approvals');
          if (res.data.success) {
            setPendingCount(res.data.count || 0);
          }
        } catch (e) {
          // silent fallback
        }
      };
      fetchApprovalCount();
      const interval = setInterval(fetchApprovalCount, 20000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bg-base text-gray-100 selection:bg-accent-mint/20">
      <div>
        <Navbar pendingApprovalCount={pendingCount} />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approvals"
              element={
                <ProtectedRoute>
                  <ApprovalQueuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cases/:id"
              element={
                <ProtectedRoute>
                  <CaseTrackerPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
