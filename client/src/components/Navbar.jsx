import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        <span>🛡️</span> NGO Disaster Response
      </Link>

      <button
        className="nav-mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle Navigation Menu"
      >
        ☰
      </button>

      <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        <NavLink to="/" onClick={closeMenu} end>
          Home
        </NavLink>
        <NavLink to="/about" onClick={closeMenu}>
          About
        </NavLink>
        <NavLink to="/services" onClick={closeMenu}>
          Services
        </NavLink>
        <NavLink to="/contact" onClick={closeMenu}>
          Contact
        </NavLink>

        {isAuthenticated ? (
          <>
            {isAdmin ? (
              <>
                <NavLink to="/admin" onClick={closeMenu}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/emergency" onClick={closeMenu}>
                  Requests
                </NavLink>
                <NavLink to="/admin/volunteers" onClick={closeMenu}>
                  Volunteers
                </NavLink>
                <NavLink to="/admin/relief" onClick={closeMenu}>
                  Materials
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/emergency" onClick={closeMenu}>
                  Emergency
                </NavLink>
                <NavLink to="/volunteer" onClick={closeMenu}>
                  Volunteer
                </NavLink>
                <NavLink to="/relief" onClick={closeMenu}>
                  Relief
                </NavLink>
                <NavLink to="/my-requests" onClick={closeMenu}>
                  My Requests
                </NavLink>
              </>
            )}

            <div className="nav-user-badge">
              <span>{user?.fullName?.split(' ')[0] || user?.username}</span>
              <span className="nav-role-tag">{user?.role}</span>
            </div>

            <button
              type="button"
              className="nav-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" id="loginLink" onClick={closeMenu}>
              Login
            </NavLink>
            <NavLink to="/signup" onClick={closeMenu}>
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
