import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import emergencyService from '../services/emergencyService';
import Loading from '../components/Loading';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await emergencyService.getMyRequests();
      if (data.success) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch your requests.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'in-progress';
      case 'resolved':
        return 'approved';
      case 'rejected':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  if (loading) {
    return <Loading message="Loading your emergency requests from database..." />;
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>My Emergency Requests</h1>
        <p>Track the status of your previously submitted emergency assistance requests.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Link to="/emergency" className="help-btn" style={{ padding: '10px 20px', fontSize: '14px' }}>
          + New Emergency Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <h3>No Emergency Requests Found</h3>
          <p>You have not submitted any emergency requests yet.</p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/emergency" className="help-btn">
              Submit Request Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Location</th>
                <th>Disaster</th>
                <th>Help Required</th>
                <th>People</th>
                <th>Date Submitted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>
                    <strong>{req.requestId || req._id.slice(-6).toUpperCase()}</strong>
                  </td>
                  <td>
                    <div>{req.location}</div>
                    <small style={{ color: 'var(--text-muted)' }}>{req.address}</small>
                  </td>
                  <td>{req.disasterType}</td>
                  <td>{req.requiredHelp}</td>
                  <td>{req.numberOfPeople}</td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${getStatusClass(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MyRequests;
