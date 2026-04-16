import React from 'react';
import { Users, UserCheck, Building2 } from 'lucide-react';
import StaticTable from '../Component/StaticTable';
import NotFoundPreview from '../Component/NotFoundPreview';
import FooterWidgets from '../Component/FooterWidgets';
import '../style/Card.css';
import '../style/Fotter.css';

const Dashboard = () => {
  return (
    <div className="dashboard-root">
      {/* Stats row */}
      <div className="stats-container">
        <div className="stat-box blue-stat">
          <div className="stat-icon-wrap"><Users size={20} /></div>
          <div className="stat-text">
            <h5>TOTAL EMPLOYEES</h5>
            <span className="count">6</span>
          </div>
        </div>
        <div className="stat-box green-stat">
          <div className="stat-icon-wrap"><UserCheck size={20} /></div>
          <div className="stat-text">
            <h5>ACTIVE EMPLOYEES</h5>
            <span className="count">4</span>
          </div>
        </div>
        <div className="stat-box yellow-stat">
          <div className="stat-icon-wrap"><Building2 size={20} /></div>
          <div className="stat-text">
            <h5>COMPANIES</h5>
            <span className="count">3</span>
          </div>
        </div>
      </div>

      {/* Main grid: Table + 404 */}
      <div className="pixel-grid">
        <div className="grid-left">
          <StaticTable />
        </div>
        <div className="grid-right">
          <NotFoundPreview />
        </div>
      </div>

      {/* Footer widgets */}
      <FooterWidgets />

      <style>{`
        .dashboard-root {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .stats-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .stat-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .blue-stat { background: #eff6ff; border-color: #bfdbfe; }
        .green-stat { background: #f0fdf4; border-color: #bbf7d0; }
        .yellow-stat { background: #fffbeb; border-color: #fef3c7; }
        
        .stat-icon-wrap {
          background: #3b82f6;
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          display: flex;
        }
        .green-stat .stat-icon-wrap { background: #10b981; }
        .yellow-stat .stat-icon-wrap { background: #f59e0b; }
        
        .stat-text h5 {
          font-size: 0.65rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .stat-text .count {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
        }
        
        .pixel-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
