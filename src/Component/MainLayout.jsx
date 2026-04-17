import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidbar from './Sidbar';
import '../style/theme.css';

const MainLayout = () => {
  return (
    <div className="App">
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#fff' }}>
        <Sidbar />
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: '#fff' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
