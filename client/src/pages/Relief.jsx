import React, { useState, useEffect } from 'react';
import reliefService from '../services/reliefService';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const Relief = () => {
  const [formData, setFormData] = useState({
    materialName: '',
    quantity: '',
    category: '',
    location: '',
  });

  const [summary, setSummary] = useState({
    Food: 0,
    Water: 0,
    Medicine: 0,
    Clothing: 0,
    'Shelter Material': 0,
    Other: 0,
    totalQuantity: 0,
  });

  const [myMaterials, setMyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: 'Message', message: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, myRes] = await Promise.all([
        reliefService.getSummary(),
        reliefService.getMyMaterials(),
      ]);

      if (sumRes.success) {
        setSummary(sumRes.summary);
      }
      if (myRes.success) {
        setMyMaterials(myRes.materials || []);
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

    const materialName = formData.materialName.trim();
    const quantity = formData.quantity;
    const category = formData.category;
    const location = formData.location.trim();

    /* Material Name Validation */
    if (materialName === '') {
      showModal('Please enter material name.');
      return;
    }

    if (materialName.length < 3) {
      showModal('Material name must be at least 3 characters.');
      return;
    }

    if (!/^[A-Za-z ]+$/.test(materialName)) {
      showModal('Material name should contain only letters.');
      return;
    }

    /* Quantity Validation */
    if (quantity === '') {
      showModal('Please enter quantity.');
      return;
    }

    if (parseInt(quantity, 10) < 1) {
      showModal('Quantity must be at least 1.');
      return;
    }

    /* Category Validation */
    if (category === '') {
      showModal('Please select a category.');
      return;
    }

    /* Location Validation */
    if (location === '') {
      showModal('Please enter distribution location.');
      return;
    }

    if (location.length < 5) {
      showModal('Location must be at least 5 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await reliefService.addMaterial({
        materialName,
        quantity: parseInt(quantity, 10),
        category,
        location,
      });

      if (res.success) {
        showModal(
          `Relief Material Added Successfully! Material ID: ${res.materialId}`
        );
        setFormData({
          materialName: '',
          quantity: '',
          category: '',
          location: '',
        });
        // Refresh live database calculations and personal list
        fetchData();
      } else {
        showModal(res.message || 'Failed to add relief material.');
      }
    } catch (err) {
      showModal(err.message || 'Failed to add relief material.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>📦 Relief Material Management</h1>
        <p>Add and manage essential relief supplies for disaster-affected people.</p>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '35px',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        {/* Relief Form */}
        <form
          className="form-card"
          style={{ width: '500px', margin: '0' }}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="materialName">Material Name</label>
            <input
              type="text"
              id="materialName"
              placeholder="Enter material name (e.g. Rice, Water, Blankets)"
              value={formData.materialName}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              min="1"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Water">Water</option>
              <option value="Medicine">Medicine</option>
              <option value="Clothing">Clothing</option>
              <option value="Shelter Material">Shelter Material</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Distribution Location</label>
            <input
              type="text"
              id="location"
              placeholder="Enter distribution location"
              value={formData.location}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            className="form-btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Adding Material...' : 'Add Relief Material'}
          </button>
        </form>

        {/* Real-Time Database Aggregation Summary */}
        <div style={{ width: '420px', maxWidth: '100%' }}>
          <h3
            style={{
              color: 'var(--primary)',
              marginBottom: '15px',
              textAlign: 'center',
            }}
          >
            📊 Live Database Inventory Summary
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            Aggregated in real-time from active MongoDB inventory records.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px',
            }}
          >
            <div className="dashboard-stat-card" style={{ padding: '18px 12px' }}>
              <h2>{summary.Food || 0}</h2>
              <p>🍲 Food Items</p>
            </div>

            <div className="dashboard-stat-card" style={{ padding: '18px 12px' }}>
              <h2>{summary.Water || 0}</h2>
              <p>💧 Water Units</p>
            </div>

            <div className="dashboard-stat-card" style={{ padding: '18px 12px' }}>
              <h2>{summary.Medicine || 0}</h2>
              <p>💊 Medical Supplies</p>
            </div>

            <div className="dashboard-stat-card" style={{ padding: '18px 12px' }}>
              <h2>{summary.Clothing || 0}</h2>
              <p>👕 Clothing / Blankets</p>
            </div>

            <div
              className="dashboard-stat-card"
              style={{ padding: '18px 12px', gridColumn: 'span 2' }}
            >
              <h2>{summary['Shelter Material'] || 0}</h2>
              <p>🏠 Shelter Materials & Tents</p>
            </div>
          </div>
        </div>
      </div>

      {/* User's Submitted Materials Table */}
      <div style={{ marginTop: '50px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '15px' }}>
          My Contributed Relief Supplies
        </h2>
        {loading ? (
          <Loading message="Loading your submitted supplies..." />
        ) : myMaterials.length === 0 ? (
          <div className="empty-state">
            <h3>No Relief Materials Contributed Yet</h3>
            <p>Use the form above to record donated or distributed supplies.</p>
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
                </tr>
              </thead>
              <tbody>
                {myMaterials.map((mat) => (
                  <tr key={mat._id}>
                    <td>
                      <strong>{mat.materialId || mat._id.slice(-6).toUpperCase()}</strong>
                    </td>
                    <td>{mat.materialName}</td>
                    <td>{mat.category}</td>
                    <td>{mat.quantity}</td>
                    <td>{mat.distributionLocation}</td>
                    <td>
                      <span
                        className={`material-status ${
                          mat.status === 'Available' ? 'available' : 'low'
                        }`}
                      >
                        {mat.status}
                      </span>
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
        onClose={closeModal}
      />
    </section>
  );
};

export default Relief;
