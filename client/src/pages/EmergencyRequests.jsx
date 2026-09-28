import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import emergencyService from '../services/emergencyService';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

const EmergencyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: 'Message', message: '' });

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const data = await emergencyService.getAllRequestsAdmin(params);
      if (data.success) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        title: 'Error',
        message: err.message || 'Failed to load requests from server.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleStatusChange = async (requestId, newStatus) => {
    setUpdatingId(requestId);
    try {
      const res = await emergencyService.updateStatusAdmin(requestId, newStatus);
      if (res.success) {
        setRequests((prev) =>
          prev.map((item) => (item._id === requestId ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      setModal({
        isOpen: true,
        title: 'Update Error',
        message: err.message || 'Failed to update request status.',
      });
    } finally {
      setUpdatingId(null);
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

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>Emergency Requests</h1>
        <p>View and manage emergency requests received from affected people.</p>
      </div>

      {/* Search and Filters */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap',
          marginBottom: '25px',
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: 'flex', gap: '10px', flex: '1', minWidth: '280px' }}
        >
          <input
            type="text"
            placeholder="Search by name, location, or Request ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              flex: '1',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            className="dashboard-btn"
            style={{ padding: '10px 18px', border: 'none' }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600' }}>Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              fontSize: '14px',
              backgroundColor: '#fff',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loading message="Loading emergency requests from MongoDB..." />
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <h3>No Emergency Requests Found</h3>
          <p>There are no emergency requests matching your current filter.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Disaster</th>
                <th>Help Required</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>
                    <strong>{req.requestId || req._id.slice(-6).toUpperCase()}</strong>
                  </td>
                  <td>{req.fullName}</td>
                  <td>{req.phone}</td>
                  <td>
                    <div>{req.location}</div>
                    <small style={{ color: 'var(--text-muted)' }}>{req.address}</small>
                  </td>
                  <td>{req.disasterType}</td>
                  <td>{req.requiredHelp} ({req.numberOfPeople} ppl)</td>
                  <td>
                    <span className={`status ${getStatusClass(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={req.status}
                      disabled={updatingId === req._id}
                      onChange={(e) => handleStatusChange(req._id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        fontSize: '13px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link to="/admin" className="back-btn">
          Back to Dashboard
        </Link>
      </div>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ isOpen: false, title: '', message: '' })}
      />
    </section>
  );
};

export default EmergencyRequests;
