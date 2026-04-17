import React from 'react';
import { Layout } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{ 
      background: '#1a202c', 
      height: '64px', 
      display: 'flex', 
      alignItems: 'center', 
      padding: '0 2rem',
      color: 'white',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Layout fill="white" size={24} />
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.05em' }}>EMPLOYEE MANAGEMENT SYSTEM</h1>
      </div>
      <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: '600' }}>
        <span>Home</span>
        <span>Employees <span style={{fontSize: '0.7rem'}}>▼</span></span>
        <span>About</span>
      </div>
    </nav>
  );
};

export default Navbar;
