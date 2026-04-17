import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import '../style/Fotter.css';

const FooterWidgets = () => {
  const features = [
    "Click Event & Function Call", "State Management (useState)", "Get Input Value (onChange)",
    "Controlled Components", "Checkbox Handling", "Passing Data Between Components",
    "Multiple Conditions (else if)", "Loop using map()", "Reusable Components",
    "Nested Loop with Components", "React Hooks", "useEffect (12 Uses)",
    "Routing (BrowserRouter, Routes, Link)", "404 Page & Redirection", "Nested Routing",
    "Layout & Index Routes"
  ];

  const technologies = [
    "React JS", "React Router DOM", "useState, useEffect", "CSS / Bootstrap (UI)"
  ];

  return (
    <div className="footer-widgets">
      <div className="widget-card features-widget">
        {/* <h3>FEATURES IMPLEMENTED</h3>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <span className="feature-number">{index + 1}.</span>
              <span className="feature-text">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="widget-card tech-widget">
        <h3>TECHNOLOGIES USED</h3>
        <ul className="tech-list">
          {technologies.map((tech, index) => (
            <li key={index} className="tech-item">
              <div className="tech-check">
                <CheckCircle2 size={16} color="#10b981" fill="#ecfdf5" />
              </div>
              <span className="tech-name">{tech}</span>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default FooterWidgets;
