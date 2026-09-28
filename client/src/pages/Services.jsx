import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <section className="page-container">
      <div className="page-header">
        <h1>Our Services</h1>
        <p>
          We provide integrated humanitarian support and management services to help
          disaster response teams coordinate effectively.
        </p>
      </div>

      <div className="cards">
        <div className="card">
          <h3>🚨 Emergency Assistance</h3>
          <p>
            Help affected individuals submit real-time rescue and support requests,
            automatically categorized and routed to response teams.
          </p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/emergency" className="dashboard-btn" style={{ padding: '8px 16px' }}>
              Request Help
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>🙋 Volunteer Management</h3>
          <p>
            Register, onboard, and mobilize skilled volunteers across medical,
            rescue, distribution, and logistical support roles.
          </p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/volunteer" className="dashboard-btn" style={{ padding: '8px 16px' }}>
              Join as Volunteer
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>📦 Relief Material Management</h3>
          <p>
            Track food, clean drinking water, medicines, blankets, and essential
            shelter equipment in real-time.
          </p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/relief" className="dashboard-btn" style={{ padding: '8px 16px' }}>
              Manage Relief
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>🏥 Medical Assistance</h3>
          <p>
            Support medical personnel and healthcare NGOs in triaging urgent medical
            needs, first-aid distribution, and trauma care.
          </p>
        </div>

        <div className="card">
          <h3>🍲 Food & Water Distribution</h3>
          <p>
            Coordinate community food kitchens, clean bottled water distribution,
            and nutritional supply lines during crisis phases.
          </p>
        </div>

        <div className="card">
          <h3>🏠 Shelter Support</h3>
          <p>
            Assist NGOs in locating, setting up, and managing temporary shelters,
            tents, and basic sanitation for displaced families.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
