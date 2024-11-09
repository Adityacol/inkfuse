import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import DepartmentCalendar from './components/DepartmentCalendar';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CommentProvider } from './contexts/CommentContext';
import Background3D from './components/Background3D';
import Navbar from './components/Navbar';
import TeamCollaboration from './components/TeamCollaboration';
import Analytics from './components/Analytics';
import ErrorBoundary from './components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <TaskProvider>
              <NotificationProvider>
                <CommentProvider>
                  <div className="relative min-h-screen">
                    <Background3D />
                    <div className="relative z-10">
                      <Navbar />
                      <AnimatePresence mode="wait">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/department/:name" element={<DepartmentCalendar />} />
                          <Route path="/admin/login" element={<AdminLogin />} />
                          <Route path="/admin/dashboard" element={<AdminDashboard />} />
                          <Route path="/team-collaboration" element={<TeamCollaboration />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </AnimatePresence>
                    </div>
                  </div>
                </CommentProvider>
              </NotificationProvider>
            </TaskProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;