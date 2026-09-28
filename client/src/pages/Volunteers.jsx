import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import volunteerService from '../services/volunteerService';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: 'Message', message: '' });

  useEffect(() => {
    fetchVolunteers();
  }, [statusFilter, skillFilter]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (skillFilter !== 'all') params.skill = skillFilter;
      if (search.trim()) params.search = search.trim();

      const data = await volunteerService.getAllVolunteersAdmin(params);
      if (data.success) {
        setVolunteers(data.volunteers || []);
      }
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        title: 'Error',
        message: err.message || 'Failed to fetch volunteers from server.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVolunteers();
  };

  const handleStatusToggle = async (volunteerId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setUpdatingId(volunteerId);
    try {
      const res = await volunteerService.updateStatusAdmin(volunteerId, newStatus);
      if (res.success) {
        setVolunteers((prev) =>
          prev.map((item) =>
            item._id === volunteerId ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (err) {
      setModal({
        isOpen: true,
        title: 'Update Error',
        message: err.message || 'Failed to update volunteer status.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>Registered Volunteers</h1>
        <p>View and manage volunteers who are available to support disaster relief operations.</p>
      </div>

      {/* Filters and Search */}
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
            placeholder="Search by name, city, skill, or Volunteer ID..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', marginRight: '6px' }}>
              Skill:
            </label>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
                backgroundColor: '#fff',
              }}
            >
              <option value="all">All Skills</option>
              <option value="Medical">Medical</option>
              <option value="Rescue">Rescue</option>
              <option value="Food Distribution">Food Distribution</option>
              <option value="Communication">Communication</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', marginRight: '6px' }}>
              Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
                backgroundColor: '#fff',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading message="Loading registered volunteers from MongoDB..." />
      ) : volunteers.length === 0 ? (
        <div className="empty-state">
          <h3>No Registered Volunteers Found</h3>
          <p>There are no volunteer records matching your current filter.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Volunteer ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Skill</th>
                <th>Availability</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol) => (
                <tr key={vol._id}>
                  <td>
                    <strong>{vol.volunteerId || vol._id.slice(-6).toUpperCase()}</strong>
                  </td>
                  <td>{vol.fullName}</td>
                  <td>{vol.city}</td>
                  <td>{vol.skills}</td>
                  <td>{vol.availability}</td>
                  <td>
                    <div>{vol.phone}</div>
                    <small style={{ color: 'var(--text-muted)' }}>{vol.email}</small>
                  </td>
                  <td>
                    <span
                      className={`volunteer-status ${
                        vol.status === 'Active' ? 'active' : 'inactive'
                      }`}
                    >
                      {vol.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      disabled={updatingId === vol._id}
                      onClick={() => handleStatusToggle(vol._id, vol.status)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: vol.status === 'Active' ? '#fef2f2' : '#f0fdf4',
                        color: vol.status === 'Active' ? '#b91c1c' : '#15803d',
                        fontWeight: '600',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {updatingId === vol._id
                        ? 'Updating...'
                        : vol.status === 'Active'
                        ? 'Set Inactive'
                        : 'Set Active'}
                    </button>
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

export default Volunteers;
