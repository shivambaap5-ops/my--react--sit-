import React, { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import Navbar from './Component/Navbar';
import Sidbar from './Component/Sidbar';
import Dashboard from './Pages/Dashboard';
import './index.css';

function App() {
  useEffect(() => {
    const initBackButton = async () => {
      await CapacitorApp.addListener('backButton', ({canGoBack}) => {
        if(!canGoBack){
          CapacitorApp.exitApp();
        } else {
          window.history.back();
        }
      });
    };
    initBackButton();
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

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
