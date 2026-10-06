import { useState } from 'react';
import Navbar from './components/Navbar';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="main-content">
        <div className="content-container">
          {activeTab === 'employees' && <EmployeesPage />}
          {activeTab === 'attendance' && <AttendancePage />}
          {activeTab === 'leave' && <LeavePage />}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <p>© 2026 University ERP System — HR Module</p>
        </div>
      </footer>
    </div>
  );
}
