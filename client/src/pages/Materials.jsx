import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reliefService from '../services/reliefService';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: 'Message', message: '' });

  useEffect(() => {
    fetchMaterials();
  }, [categoryFilter, statusFilter]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const data = await reliefService.getAllMaterialsAdmin(params);
      if (data.success) {
        setMaterials(data.materials || []);
      }
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        title: 'Error',
        message: err.message || 'Failed to fetch relief materials from server.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMaterials();
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await reliefService.updateMaterial(id, { status: newStatus });
      if (res.success) {
        setMaterials((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      setModal({
        isOpen: true,
        title: 'Update Error',
        message: err.message || 'Failed to update material status.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove '${name}' from inventory?`)) {
      return;
    }

    try {
      const res = await reliefService.deleteMaterial(id);
      if (res.success) {
        setMaterials((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      setModal({
        isOpen: true,
        title: 'Delete Error',
        message: err.message || 'Failed to delete relief material.',
      });
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'available';
      case 'low stock':
        return 'low';
      default:
        return 'inactive';
    }
  };

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>Relief Materials</h1>
        <p>Manage food, water, medicines and other essential materials used during disaster relief operations.</p>
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
            placeholder="Search material, location, or Material ID..."
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
              Category:
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
                backgroundColor: '#fff',
              }}
            >
              <option value="all">All Categories</option>
              <option value="Food">Food</option>
              <option value="Water">Water</option>
              <option value="Medicine">Medicine</option>
              <option value="Clothing">Clothing</option>
              <option value="Shelter Material">Shelter Material</option>
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
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Distributed">Distributed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading message="Loading relief inventory from MongoDB..." />
      ) : materials.length === 0 ? (
        <div className="empty-state">
          <h3>No Relief Materials Found</h3>
          <p>There are no relief material records matching your current filter.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Material ID</th>
                <th>Material Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((mat) => (
                <tr key={mat._id}>
                  <td>
                    <strong>{mat.materialId || mat._id.slice(-6).toUpperCase()}</strong>
                  </td>
                  <td>{mat.materialName}</td>
                  <td>{mat.category}</td>
                  <td>{mat.quantity}</td>
                  <td>{mat.distributionLocation}</td>
                  <td>
                    <span className={`material-status ${getStatusClass(mat.status)}`}>
                      {mat.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select
                        value={mat.status}
                        disabled={updatingId === mat._id}
                        onChange={(e) => handleStatusChange(mat._id, e.target.value)}
                        style={{
                          padding: '5px 8px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          fontSize: '13px',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Available">Available</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Distributed">Distributed</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDelete(mat._id, mat.materialName)}
                        style={{
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '4px',
                          padding: '5px 9px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                        title="Delete material"
                      >
                        Delete
                      </button>
                    </div>
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

export default Materials;
