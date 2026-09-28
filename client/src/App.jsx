import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Emergency from './pages/Emergency';
import Volunteer from './pages/Volunteer';
import Relief from './pages/Relief';
import MyRequests from './pages/MyRequests';
import AdminDashboard from './pages/AdminDashboard';
import EmergencyRequests from './pages/EmergencyRequests';
import Volunteers from './pages/Volunteers';
import Materials from './pages/Materials';

import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* User Protected Routes */}
              <Route
                path="/emergency"
                element={
                  <ProtectedRoute>
                    <Emergency />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteer"
                element={
                  <ProtectedRoute>
                    <Volunteer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/relief"
                element={
                  <ProtectedRoute>
                    <Relief />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-requests"
                element={
                  <ProtectedRoute>
                    <MyRequests />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/emergency"
                element={
                  <AdminRoute>
                    <EmergencyRequests />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/volunteers"
                element={
                  <AdminRoute>
                    <Volunteers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/relief"
                element={
                  <AdminRoute>
                    <Materials />
                  </AdminRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
