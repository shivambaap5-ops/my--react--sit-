import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

const NotFoundPreview = () => {
  return (
    <div className="pixel-404" style={{ 
      background: '#fff5f5',
      border: '1px solid #fff5f5',
      borderRadius: '12px',
      padding: '3rem 2rem',
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1.5rem'
    }}>
      <h1 style={{ fontSize: '6rem', color: '#f56565', fontWeight: '800', margin: 0, lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', color: '#2d3748', fontWeight: '800', margin: 0 }}>Page Not Found</h2>
      
      <div style={{ color: '#f56565', background: '#fff', padding: '1rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <AlertCircle size={48} />
      </div>
      
      <p style={{ color: '#4a5568', lineHeight: '1.6', fontSize: '0.9rem' }}>
        Sorry, the page you are looking for doesn't exist.
      </p>
      
      <button style={{ 
        background: '#e53e3e', 
        color: 'white', 
        border: 'none', 
        padding: '0.875rem 2rem', 
        borderRadius: '6px',
        fontWeight: '700',
        cursor: 'pointer',
        width: '100%'
      }}>
        Go Home
      </button>
    </div>
  );
};

export default NotFoundPreview;
