import React from 'react';
import Navbar from './Component/Navbar';
import Sidbar from './Component/Sidbar';
import Dashboard from './Pages/Dashboard';
import './index.css';

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#fff' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>  
        <Sidbar />
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;
