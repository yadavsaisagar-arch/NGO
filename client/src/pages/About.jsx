import React from 'react';

const About = () => {
  return (
    <section className="page-container">
      <div className="page-header">
        <h1>About Our System</h1>
        <p>
          NGO Disaster Response Management System is a full-stack digital platform
          designed to empower humanitarian organizations and emergency responders in
          coordinating rapid, reliable relief operations.
        </p>
      </div>

      <div className="cards" style={{ marginTop: '20px' }}>
        <div className="card">
          <h3>🎯 Our Mission</h3>
          <p>
            Our mission is to support NGOs in providing quick, organized, and
            transparent assistance to vulnerable populations affected by natural
            and man-made disasters.
          </p>
        </div>

        <div className="card">
          <h3>🚨 What We Do</h3>
          <p>
            The system enables real-time emergency request tracking, volunteer
            mobilization, relief supply chain management, and community-wide
            communication during critical situations.
          </p>
        </div>

        <div className="card">
          <h3>🤝 Community Support</h3>
          <p>
            We bridge the gap between affected citizens, relief workers, and
            NGO leadership so that lifesaving assistance reaches those in urgent need
            without delays.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
