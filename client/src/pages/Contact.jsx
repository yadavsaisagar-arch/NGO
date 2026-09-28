import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import contactService from '../services/contactService';
import Modal from '../components/Modal';

const Contact = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: 'Message', message: '' });

  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const showModal = (msg, title = 'Message') => {
    setModal({ isOpen: true, title, message: msg });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanMsg = message.trim();

    if (!cleanName) {
      showModal('Please enter your full name.');
      return;
    }
    if (cleanName.length < 6) {
      showModal('Full name must be at least 6 characters.');
      return;
    }
    if (!/^[A-Za-z ]+$/.test(cleanName)) {
      showModal('Full name should contain only letters.');
      return;
    }
    if (!cleanEmail) {
      showModal('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showModal('Please enter a valid email address.');
      return;
    }
    if (!cleanMsg) {
      showModal('Please enter your message.');
      return;
    }
    if (cleanMsg.length < 10) {
      showModal('Message must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await contactService.sendMessage({
        fullName: cleanName,
        email: cleanEmail,
        message: cleanMsg,
      });

      if (res.success) {
        showModal('Message Sent Successfully!');
        setFullName('');
        setEmail('');
        setMessage('');
      } else {
        showModal(res.data?.message || 'Message could not be sent.');
      }
    } catch (err) {
      showModal(err.message || 'Message could not be sent. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>📞 Contact Us</h1>
        <p>Contact us for any questions, support, or emergency coordination information.</p>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        {/* Contact Info Card */}
        <div
          className="form-card"
          style={{ width: '380px', margin: '0' }}
        >
          <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>
            Get In Touch
          </h2>
          <p style={{ margin: '14px 0', fontSize: '15px' }}>
            📧 <strong>Email:</strong> ngodisaster@example.com
          </p>
          <p style={{ margin: '14px 0', fontSize: '15px' }}>
            📞 <strong>Phone:</strong> 9876543210
          </p>
          <p style={{ margin: '14px 0', fontSize: '15px' }}>
            📍 <strong>Address:</strong> Mumbai, Maharashtra, India
          </p>
          <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Emergency Helplines are monitored 24/7 during regional alerts.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          className="form-card"
          style={{ width: '480px', margin: '0' }}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="contactName">Full Name</label>
            <input
              type="text"
              id="contactName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">Email</label>
            <input
              type="email"
              id="contactEmail"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactMessage">Message</label>
            <textarea
              id="contactMessage"
              rows="5"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submitting}
            ></textarea>
          </div>

          <button
            type="submit"
            className="form-btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />
    </section>
  );
};

export default Contact;
