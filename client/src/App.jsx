import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/authStore';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AITutor from './pages/AITutor';
import Onboarding from './pages/Onboarding';
import Roadmap from './pages/Roadmap';
import Planner from './pages/Planner';
import Revision from './pages/Revision';
import StudyGroups from './pages/StudyGroups';
import StudyRoom from './pages/StudyRoom';
import Settings from './pages/Settings';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

const Layout = ({ children }) => (
  <div className="flex min-h-screen w-full overflow-hidden relative">
    <div className="ambient-bg" />
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected Dashboard Pages */}
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/tutor" element={<ProtectedRoute><Layout><AITutor /></Layout></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Layout><Roadmap /></Layout></ProtectedRoute>} />
        <Route path="/planner" element={<ProtectedRoute><Layout><Planner /></Layout></ProtectedRoute>} />
        <Route path="/revision" element={<ProtectedRoute><Layout><Revision /></Layout></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><Layout><StudyGroups /></Layout></ProtectedRoute>} />
        <Route path="/room/:id" element={<ProtectedRoute><Layout><StudyRoom /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster position="top-right" toastOptions={{
        style: {
          borderRadius: '14px',
          background: '#1a1d2e',
          color: '#e2e8f0',
          fontWeight: 600,
          fontSize: '13px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.5)',
        },
      }} />
    </Router>
  );
}

export default App;
