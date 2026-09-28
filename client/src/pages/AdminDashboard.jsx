import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import emergencyService from '../services/emergencyService';
import contactService from '../services/contactService';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, title: 'Message', message: '' });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboardStats();
      if (data.success) {
        setStats(data.stats);
        setRecent(data.recent);
      }
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        title: 'Error',
        message: err.message || 'Failed to load dashboard statistics.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const res = await emergencyService.updateStatusAdmin(requestId, newStatus);
      if (res.success) {
        fetchDashboard();
      }
    } catch (err) {
      setModal({
        isOpen: true,
        title: 'Update Error',
        message: err.message || 'Failed to update request status.',
      });
    }
  };

  const handleMarkMessageRead = async (messageId) => {
    try {
      const res = await contactService.updateStatusAdmin(messageId, 'Read');
      if (res.success) {
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
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
    return <Loading message="Loading real-time admin metrics from database..." />;
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage disaster response activities, volunteers, inventory and support services.</p>
      </div>

      {/* Real-Time Database Metrics Cards */}
      <div className="dashboard-grid-stats">
        {/* Emergency Requests */}
        <div className="dashboard-stat-card">
          <h2>{stats?.totalEmergency || 0}</h2>
          <p>Emergency Requests</p>
          <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--danger)' }}>
            ⚠️ {stats?.pendingRequests || 0} Pending
          </div>
        </div>

        {/* Registered Volunteers */}
        <div className="dashboard-stat-card">
          <h2>{stats?.totalVolunteers || 0}</h2>
          <p>Registered Volunteers</p>
          <div style={{ marginTop: '8px', fontSize: '13px', color: '#16a34a' }}>
            ✓ {stats?.activeVolunteers || 0} Active
          </div>
        </div>

        {/* Relief Materials */}
        <div className="dashboard-stat-card">
          <h2>{stats?.totalReliefMaterials || 0}</h2>
          <p>Relief Materials</p>
          <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--primary)' }}>
            📦 {stats?.totalReliefQuantity || 0} Total Units
          </div>
        </div>

        {/* Active Operations */}
        <div className="dashboard-stat-card">
          <h2>{stats?.activeOperations || 0}</h2>
          <p>Active Operations</p>
          <div style={{ marginTop: '8px', fontSize: '13px', color: '#0284c7' }}>
            🔄 In Progress
          </div>
        </div>

        {/* Total Users */}
        <div className="dashboard-stat-card">
          <h2>{stats?.totalUsers || 0}</h2>
          <p>Total Registered Users</p>
          <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            👤 Accounts
          </div>
        </div>

        {/* Inquiries */}
        <div className="dashboard-stat-card">
          <h2>{stats?.unreadMessages || 0}</h2>
          <p>Unread Inquiries</p>
          <div style={{ marginTop: '8px', fontSize: '13px', color: '#eab308' }}>
            ✉️ Contact Messages
          </div>
        </div>
      </div>

      {/* Management Options (Preserving admin.html exact layout) */}
      <h2 style={{ color: 'var(--primary)', margin: '40px 0 20px', textAlign: 'center' }}>
        Operations Management
      </h2>

      <div className="management-grid">
        <div className="management-box">
          <div>
            <h3>🚨 Emergency Requests</h3>
            <p>
              View, triage, and manage emergency help requests received from affected people in disaster zones.
            </p>
          </div>
          <Link to="/admin/emergency" className="dashboard-btn">
            View Requests
          </Link>
        </div>

        <div className="management-box">
          <div>
            <h3>🙋 Volunteers</h3>
            <p>
              View registered volunteers, filter by specialized medical and rescue skills, and manage participation.
            </p>
          </div>
          <Link to="/admin/volunteers" className="dashboard-btn">
            Manage Volunteers
          </Link>
        </div>

        <div className="management-box">
          <div>
            <h3>📦 Relief Materials</h3>
            <p>
              Manage available food, clean water, medicines, blankets, and essential relief logistics.
            </p>
          </div>
          <Link to="/admin/relief" className="dashboard-btn">
            Manage Materials
          </Link>
        </div>
      </div>

      {/* Recent Emergency Requests Section */}
      <div style={{ marginTop: '50px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
          }}
        >
          <h2 style={{ color: 'var(--primary)', fontSize: '22px' }}>
            Recent Emergency Requests
          </h2>
          <Link to="/admin/emergency" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '14px' }}>
            View All ({stats?.totalEmergency || 0}) →
          </Link>
        </div>

        {!recent?.emergencyRequests || recent.emergencyRequests.length === 0 ? (
          <div className="empty-state">
            <p>No recent emergency requests.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Disaster</th>
                  <th>Help</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.emergencyRequests.map((req) => (
                  <tr key={req._id}>
                    <td>
                      <strong>{req.requestId}</strong>
                    </td>
                    <td>{req.fullName}</td>
                    <td>{req.location}</td>
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
                        onChange={(e) => handleStatusChange(req._id, e.target.value)}
                        style={{
                          padding: '5px 8px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          fontSize: '12px',
                          backgroundColor: '#fff',
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
      </div>

      {/* Recent Inquiries Inbox Section */}
      <div style={{ marginTop: '40px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
          }}
        >
          <h2 style={{ color: 'var(--primary)', fontSize: '22px' }}>
            Recent Inquiries & Contact Messages
          </h2>
        </div>

        {!recent?.messages || recent.messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages in contact inbox.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sender</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.messages.map((msg) => (
                  <tr key={msg._id}>
                    <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td><strong>{msg.fullName}</strong></td>
                    <td>{msg.email}</td>
                    <td style={{ maxWidth: '300px' }}>{msg.message}</td>
                    <td>
                      <span
                        className={`status ${
                          msg.status === 'Unread' ? 'pending' : 'approved'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td>
                      {msg.status === 'Unread' && (
                        <button
                          type="button"
                          onClick={() => handleMarkMessageRead(msg._id)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: '#f0fdf4',
                            color: '#15803d',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Mark Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

export default AdminDashboard;
