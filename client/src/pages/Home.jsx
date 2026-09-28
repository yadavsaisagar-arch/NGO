import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Home / Hero Section */}
      <section className="hero">
        <h1>Helping People During Disasters</h1>
        <p>
          Our system helps NGOs manage emergency support, volunteers and relief
          activities efficiently and transparently.
        </p>

        <div className="buttons">
          <Link to="/emergency" className="help-btn">
            🚨 Request Help
          </Link>
          <Link to="/volunteer" className="volunteer-btn">
            🙋 Become a Volunteer
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Core Services</h2>

        <div className="cards">
          <div className="card">
            <h3>🚨 Emergency Help</h3>
            <p>
              Get quick assistance during disaster situations. Submit an emergency
              request with your location and relief requirements.
            </p>
          </div>

          <div className="card">
            <h3>🙋 Volunteer Support</h3>
            <p>
              Join our dedicated network of volunteers and provide on-ground
              support to disaster-affected communities.
            </p>
          </div>

          <div className="card">
            <h3>📦 Relief Distribution</h3>
            <p>
              Manage, track, and distribute essential relief materials including
              food, clean water, medical aid, and shelter.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
