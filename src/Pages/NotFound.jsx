import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page" style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div className="card" style={{ 
        maxWidth: '450px', 
        textAlign: 'center', 
        padding: '3rem !important',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <h1 style={{ fontSize: '6rem', fontWeight: '800', color: '#ef4444', margin: 0 }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Page Not Found</h2>
        
        <div style={{ color: '#ef4444', background: '#fef2f2', padding: '1.5rem', borderRadius: '1rem' }}>
          <AlertCircle size={48} />
        </div>
        
        <p style={{ color: '#64748b', lineHeight: '1.6' }}>
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '0.75rem 2rem' }}>
          <Home size={18} /> Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
