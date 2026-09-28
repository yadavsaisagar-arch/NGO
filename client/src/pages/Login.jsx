import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: 'Message', message: '' });

  const showModal = (message, title = 'Message') => {
    setModal({ isOpen: true, title, message });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      showModal('Please enter your username.');
      return;
    }

    if (!cleanPassword) {
      showModal('Please enter your password.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await login({ username: cleanUsername, password: cleanPassword });
      if (result.success) {
        // Redirect based on role
        if (result.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          const from = location.state?.from?.pathname || '/';
          navigate(from);
        }
      } else {
        showModal(result.message || 'Invalid Username or Password!');
      }
    } catch (err) {
      showModal(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1>Login</h1>
        <p>Login to access the NGO disaster response system.</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={submitting}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="form-btn-submit"
          disabled={submitting}
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>

        <p className="signup-link">
          New Member? <Link to="/signup">Sign Up</Link>
        </p>
      </form>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />
    </div>
  );
};

export default Login;
