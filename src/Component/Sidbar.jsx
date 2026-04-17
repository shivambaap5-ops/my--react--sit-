import React from 'react';
import { LayoutDashboard, Users, Info } from 'lucide-react';

const Sidbar = () => {
  return (
    <aside style={{ 
      width: '240px', 
      background: '#fff', 
      borderRight: '1px solid #e2e8f0',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div>
        <h6 style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', margin: '0 0 1rem 0.75rem' }}>MAIN</h6>
        <div style={{ 
          background: '#3b82f6', 
          color: 'white', 
          padding: '0.75rem 1rem', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: '700',
          fontSize: '0.9rem'
        }}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </div>
      </div>

      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '0.75rem 1rem',
          color: '#475569',
          fontWeight: '700',
          fontSize: '0.9rem'
        }}>
          <Users size={18} />
          <span>Employees</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>▼</span>
        </div>
        <div style={{ paddingLeft: '3rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>Employee List</span>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>Add Employee</span>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        padding: '0.75rem 1rem',
        color: '#475569',
        fontWeight: '700',
        fontSize: '0.9rem'
      }}>
        <Info size={18} />
        <span>About</span>
      </div>
    </aside>
  );
};

export default Sidbar;
