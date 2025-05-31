// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from './contexts/AuthContext';

// ProtectedRoute component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

// GuestRoute component (redirects if logged in)
function GuestRoute({ children }) {
    const { currentUser } = useAuth();
    return !currentUser ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
        <Header />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Basic 404 redirect to home */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

