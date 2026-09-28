import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import emergencyService from '../services/emergencyService';
import Modal from '../components/Modal';

const Emergency = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    address: '',
    disasterType: '',
    people: '',
    requiredHelp: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: 'Message',
    message: '',
    isSuccess: false,
    newRequestId: null,
  });

  // Pre-fill user name if logged in
  useEffect(() => {
    if (user?.fullName) {
      setFormData((prev) => ({ ...prev, fullName: user.fullName }));
    }
  }, [user]);

  const showModal = (msg, title = 'Message', isSuccess = false, newRequestId = null) => {
    setModal({ isOpen: true, title, message: msg, isSuccess, newRequestId });
  };

  const closeModal = () => {
    const wasSuccess = modal.isSuccess;
    setModal({ isOpen: false, title: '', message: '', isSuccess: false, newRequestId: null });
    if (wasSuccess) {
      navigate('/my-requests');
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = formData.fullName.trim();
    const phone = formData.phone.trim();
    const location = formData.location.trim();
    const address = formData.address.trim();
    const disasterType = formData.disasterType;
    const people = formData.people;
    const requiredHelp = formData.requiredHelp;
    const description = formData.description.trim();

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

    /* Location Validation */
    if (location === '') {
      showModal('Please enter your location.');
      return;
    }

    if (location.length < 6) {
      showModal('Location must be at least 6 characters.');
      return;
    }

    /* Address Validation */
    if (address === '') {
      showModal('Please enter your address.');
      return;
    }

    if (address.length < 10) {
      showModal('Address must be at least 10 characters.');
      return;
    }

    if (!/[A-Za-z]/.test(address) || !/[0-9]/.test(address)) {
      showModal('Address must contain both letters and numbers.');
      return;
    }

    /* Disaster Type Validation */
    if (disasterType === '') {
      showModal('Please select a disaster type.');
      return;
    }

    /* Number of People Validation */
    if (people === '') {
      showModal('Please enter the number of people.');
      return;
    }

    if (parseInt(people, 10) < 1) {
      showModal('Number of people must be at least 1.');
      return;
    }

    /* Required Help Validation */
    if (requiredHelp === '') {
      showModal('Please select the required help.');
      return;
    }

    /* Description Validation */
    if (description === '') {
      showModal('Please describe your emergency situation.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await emergencyService.createRequest({
        fullName,
        phone,
        location,
        address,
        disasterType,
        numberOfPeople: parseInt(people, 10),
        requiredHelp,
        description,
      });

      if (res.success) {
        showModal(
          `Emergency Request Submitted Successfully! Tracking ID: ${res.requestId}`,
          'Request Confirmed',
          true,
          res.requestId
        );
      } else {
        showModal(res.message || 'Submission failed.');
      }
    } catch (err) {
      showModal(err.message || 'Failed to submit emergency request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>🚨 Request Emergency Help</h1>
        <p>Fill in the details below to request immediate emergency assistance.</p>
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
          />
        </div>

        {/* Phone */}
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

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Enter your location (City/Area)"
            value={formData.location}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            rows="3"
            placeholder="Enter your complete address (with house/building and street)"
            value={formData.address}
            onChange={handleChange}
            disabled={submitting}
          ></textarea>
        </div>

        {/* Disaster Type */}
        <div className="form-group">
          <label htmlFor="disasterType">Disaster Type</label>
          <select
            id="disasterType"
            value={formData.disasterType}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="">Select Disaster Type</option>
            <option value="Flood">Flood</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Fire">Fire</option>
            <option value="Cyclone">Cyclone</option>
            <option value="Landslide">Landslide</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Number of People */}
        <div className="form-group">
          <label htmlFor="people">Number of People</label>
          <input
            type="number"
            id="people"
            min="1"
            placeholder="Enter number of people"
            value={formData.people}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>

        {/* Required Help */}
        <div className="form-group">
          <label htmlFor="requiredHelp">Required Help</label>
          <select
            id="requiredHelp"
            value={formData.requiredHelp}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="">Select Required Help</option>
            <option value="Food">Food</option>
            <option value="Water">Water</option>
            <option value="Medical">Medical Assistance</option>
            <option value="Shelter">Shelter</option>
            <option value="Rescue">Rescue</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Emergency Description</label>
          <textarea
            id="description"
            rows="4"
            placeholder="Describe your emergency situation and urgent requirements"
            value={formData.description}
            onChange={handleChange}
            disabled={submitting}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="form-btn-submit form-btn-emergency"
          disabled={submitting}
        >
          {submitting ? 'Submitting Request...' : 'Submit Emergency Request'}
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

export default Emergency;
