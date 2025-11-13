import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import NotificationBanner from './NotificationBanner';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>HelpDesk Lite</h1>
          <p className="tagline">Ticketing simplified</p>
        </div>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/tickets">Tickets</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin/categories">Categories</NavLink>}
        </nav>
        <div className="user-meta">
          <span>{user?.name}</span>
          <span className="role-badge">{user?.role}</span>
          <button type="button" className="outline-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {notification && (
        <NotificationBanner
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <main className="app-content">
        <Outlet context={{ setNotification }} />
      </main>
    </div>
  );
};

export default Layout;

