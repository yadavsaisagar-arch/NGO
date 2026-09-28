import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: 'Message',
    message: '',
    isSuccess: false,
  });

  const showModal = (message, title = 'Message', isSuccess = false) => {
    setModal({ isOpen: true, title, message, isSuccess });
  };

  const closeModal = () => {
    const wasSuccess = modal.isSuccess;
    setModal({ isOpen: false, title: '', message: '', isSuccess: false });
    if (wasSuccess) {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const username = formData.username.trim();
    const password = formData.password.trim();

    /* Full Name Validation */
    if (fullName === '') {
      showModal('Please enter your full name.');
      return;
    }

    if (fullName.length < 6) {
      showModal('Full name must be at least 6 characters.');
      return;
    }

    if (!/^[A-Za-z ]+$/.test(fullName)) {
      showModal('Full name should contain only letters.');
      return;
    }

    /* Email Validation */
    if (email === '') {
      showModal('Please enter your email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showModal('Please enter a valid email address.');
      return;
    }

    /* Username Validation */
    if (username === '') {
      showModal('Please create a username.');
      return;
    }

    if (username.length < 3) {
      showModal('Username must be at least 3 characters.');
      return;
    }

    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      showModal('Username should contain only letters, numbers, and underscores.');
      return;
    }

    /* Password Validation */
    if (password === '') {
      showModal('Please create a password.');
      return;
    }

    if (password.length < 6) {
      showModal('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await register({
        fullName,
        email,
        username,
        password,
      });

      if (result.success) {
        showModal('Registration Successful!', 'Message', true);
      } else {
        showModal(result.message || 'Registration failed.');
      }
    } catch (err) {
      showModal(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1>Sign Up</h1>
        <p>Create an account for the NGO disaster response system.</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="email"
          />
        </div>

        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Create a username"
            value={formData.username}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="username"
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="new-password"
          />
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          className="form-btn-submit"
          disabled={submitting}
        >
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="signup-link">
          Already have an account? <Link to="/login">Login</Link>
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

export default Signup;
