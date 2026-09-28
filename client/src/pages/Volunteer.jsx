import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import volunteerService from '../services/volunteerService';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const Volunteer = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    skills: '',
    availability: '',
    experience: '',
  });

  const [existingVolunteer, setExistingVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: 'Message', message: '' });

  useEffect(() => {
    fetchVolunteerProfile();
  }, [user]);

  const fetchVolunteerProfile = async () => {
    setLoading(true);
    try {
      const data = await volunteerService.getMyProfile();
      if (data.success && data.volunteer) {
        setExistingVolunteer(data.volunteer);
        setFormData({
          fullName: data.volunteer.fullName || '',
          phone: data.volunteer.phone || '',
          email: data.volunteer.email || '',
          city: data.volunteer.city || '',
          skills: data.volunteer.skills || '',
          availability: data.volunteer.availability || '',
          experience: data.volunteer.previousExperience || '',
        });
      } else {
        // Pre-fill user defaults
        setFormData((prev) => ({
          ...prev,
          fullName: user?.fullName || '',
          email: user?.email || '',
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (msg, title = 'Message') => {
    setModal({ isOpen: true, title, message: msg });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', message: '' });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = formData.fullName.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const city = formData.city.trim();
    const skills = formData.skills;
    const availability = formData.availability;
    const experience = formData.experience.trim();

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

    /* Phone Validation */
    if (phone === '') {
      showModal('Please enter your phone number.');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      showModal('Phone number must contain exactly 10 digits.');
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

    /* City Validation */
    if (city === '') {
      showModal('Please enter your city.');
      return;
    }

    if (city.length < 3) {
      showModal('City must be at least 3 characters.');
      return;
    }

    if (!/^[A-Za-z ]+$/.test(city)) {
      showModal('City should contain only letters.');
      return;
    }

    /* Skills Validation */
    if (skills === '') {
      showModal('Please select your skill.');
      return;
    }

    /* Availability Validation */
    if (availability === '') {
      showModal('Please select your availability.');
      return;
    }

    /* Experience Validation */
    if (experience === '') {
      showModal('Please enter your previous experience.');
      return;
    }

    if (experience.length < 10) {
      showModal('Experience must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await volunteerService.registerVolunteer({
        fullName,
        phone,
        email,
        city,
        skills,
        availability,
        previousExperience: experience,
      });

      if (res.success) {
        setExistingVolunteer(res.volunteer);
        showModal(
          `${res.message} Volunteer ID: ${res.volunteerId}`,
          'Registration Confirmed'
        );
      } else {
        showModal(res.message || 'Registration failed.');
      }
    } catch (err) {
      showModal(err.message || 'Failed to submit volunteer registration.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading volunteer registration details..." />;
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>🙋 Become a Volunteer</h1>
        <p>Register as a volunteer and help people during disaster situations.</p>
      </div>

      {/* If existing volunteer, display current registration banner */}
      {existingVolunteer && (
        <div
          className="form-card"
          style={{
            marginBottom: '25px',
            backgroundColor: '#f8fafc',
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--primary)', marginBottom: '4px' }}>
                You are registered as a Volunteer
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Volunteer ID: <strong>{existingVolunteer.volunteerId}</strong> | Assigned Skill:{' '}
                <strong>{existingVolunteer.skills}</strong>
              </p>
            </div>
            <span
              className={`volunteer-status ${
                existingVolunteer.status === 'Active' ? 'active' : 'inactive'
              }`}
            >
              {existingVolunteer.status}
            </span>
          </div>
        </div>
      )}

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
          />
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            placeholder="Enter 10 digit phone number"
            maxLength="10"
            value={formData.phone}
            onChange={handleChange}
            disabled={submitting}
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
          />
        </div>

        {/* City */}
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>

        {/* Skills */}
        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <select
            id="skills"
            value={formData.skills}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="">Select your skill</option>
            <option value="Medical">Medical</option>
            <option value="Rescue">Rescue</option>
            <option value="Food Distribution">Food Distribution</option>
            <option value="Communication">Communication</option>
            <option value="Transportation">Transportation</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Availability */}
        <div className="form-group">
          <label htmlFor="availability">Availability</label>
          <select
            id="availability"
            value={formData.availability}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="">Select availability</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Weekends">Weekends</option>
          </select>
        </div>

        {/* Previous Experience */}
        <div className="form-group">
          <label htmlFor="experience">Previous Experience</label>
          <textarea
            id="experience"
            rows="4"
            placeholder="Describe your previous humanitarian or field experience"
            value={formData.experience}
            onChange={handleChange}
            disabled={submitting}
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="form-btn-submit volunteer-btn"
          disabled={submitting}
        >
          {submitting
            ? 'Submitting...'
            : existingVolunteer
            ? 'Update Volunteer Profile'
            : 'Register as Volunteer'}
        </button>
      </form>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />
    </section>
  );
};

export default Volunteer;
