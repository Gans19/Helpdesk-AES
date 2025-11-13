import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { useAuth } from '../providers/AuthProvider';
import api from '../services/api';

const statusOrder = [
  { key: 'open', label: 'Open Tickets', accent: 'open', change: '↓ 10%', changeType: 'down' },
  { key: 'in_progress', label: 'In Progress', accent: 'primary', change: '↑ 40%', changeType: 'up', showGraph: true },
  { key: 'resolved', label: 'Resolved', accent: 'resolved', change: '↑ 20%', changeType: 'up' }
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard');
        setCounts(res.data.data.totals || {});
        setRecent(res.data.data.recent || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const closedCount = counts.closed || 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h1>Welcome back, {user?.name}</h1>
        <p className="welcome-subtitle">Here are the latest updates from the past 7 days.</p>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="dashboard-layout">
        <div className="dashboard-main">
          <section className="stats-grid">
            {statusOrder.map((item) => (
              <DashboardCard
                key={item.key}
                title={item.label}
                value={counts[item.key] || 0}
                change={item.change}
                changeType={item.changeType}
                accent={item.accent}
                showGraph={item.showGraph}
              />
            ))}
            <DashboardCard
              title="Closed Tickets"
              value={closedCount}
              change="↑ 5%"
              changeType="up"
              accent="closed"
            />
          </section>

          <section className="tickets-card">
            <div className="card-header">
              <h3>Tickets Activity</h3>
              <div className="card-actions">
                <span className="date-range">Oct 01, 2025 - Oct 07, 2025</span>
              </div>
            </div>
            {loading ? (
              <div className="loading-state">
                <p className="muted">Loading tickets...</p>
              </div>
            ) : (
              <div className="tickets-list">
                {recent.length > 0 ? (
                  recent.slice(0, 5).map((ticket) => (
                    <Link key={ticket.id} to={`/tickets/${ticket.id}`} className="ticket-item">
                      <div className="ticket-info">
                        <h4>{ticket.title}</h4>
                        <p className="ticket-meta">
                          <span className={`badge status-${ticket.status}`}>{ticket.status}</span>
                          <span className="ticket-category">{ticket.category_name}</span>
                          <span className="ticket-owner">{ticket.owner_name}</span>
                        </p>
                      </div>
                      <div className="ticket-priority">
                        <span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="muted">No tickets yet.</p>
                )}
              </div>
            )}
          </section>
        </div>

        <aside className="dashboard-sidebar">
          <Link to="/tickets/new" className="automation-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>New Ticket</span>
          </Link>

          <section className="sidebar-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {recent.slice(0, 3).map((ticket) => (
                <div key={ticket.id} className="activity-item">
                  <div className="activity-content">
                    <p className="activity-title">{ticket.title}</p>
                    <p className="activity-time">
                      {new Date(ticket.created_at).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                  <div className="activity-avatars">
                    <div className="avatar-circle">{ticket.owner_name?.charAt(0)}</div>
                    {ticket.assignee_name && (
                      <div className="avatar-circle">{ticket.assignee_name?.charAt(0)}</div>
                    )}
                  </div>
                </div>
              ))}
              {recent.length === 0 && (
                <p className="muted">No recent activity</p>
              )}
            </div>
          </section>

          {recent.length > 0 && (
            <section className="sidebar-card">
              <h3>Next Ticket</h3>
              <div className="next-ticket">
                <div className="next-ticket-header">
                  <div className="next-ticket-avatar">
                    {recent[0].owner_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="next-ticket-info">
                    <h4>{recent[0].owner_name}</h4>
                    <p className="next-ticket-time">
                      {new Date(recent[0].created_at).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                </div>
                <div className="next-ticket-details">
                  <div className="detail-row">
                    <span className="detail-label">Ticket ID</span>
                    <span className="detail-value">#{recent[0].id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className={`badge status-${recent[0].status}`}>{recent[0].status}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Priority</span>
                    <span className={`badge priority-${recent[0].priority}`}>{recent[0].priority}</span>
                  </div>
                </div>
                <Link to={`/tickets/${recent[0].id}`} className="view-ticket-btn">
                  View Ticket
                </Link>
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;

