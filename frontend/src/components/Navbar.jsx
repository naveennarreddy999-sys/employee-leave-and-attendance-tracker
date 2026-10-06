export default function Navbar({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'employees', label: 'Employees' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'leave', label: 'Leave Requests' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo">ERP</div>
          <div className="brand-text">
            <h1 className="brand-title">Attendance & Leave Portal</h1>
            <span className="brand-subtitle">University HR Management System</span>
          </div>
        </div>

        <nav className="navbar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onSelectTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
