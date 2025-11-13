import { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import { useAuth } from '../providers/AuthProvider';
import api from '../services/api';

const statusOrder = [
  { key: 'open', label: 'Open', accent: 'open' },
  { key: 'in_progress', label: 'In Progress', accent: 'progress' },
  { key: 'resolved', label: 'Resolved', accent: 'resolved' },
  { key: 'closed', label: 'Closed', accent: 'closed' }
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

  return (
    <div className="page">
      <header className="page-header">
        <h2>Dashboard</h2>
        <p className="muted">Welcome back, {user?.name}</p>
      </header>

      {error && <div className="form-error">{error}</div>}

      <section className="cards-grid">
        {statusOrder.map((item) => (
          <DashboardCard
            key={item.key}
            title={item.label}
            value={counts[item.key] || 0}
            accent={item.accent}
          />
        ))}
      </section>

      <section className="card">
        <h3>Recent tickets</h3>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td><span className={`badge status-${ticket.status}`}>{ticket.status}</span></td>
                  <td><span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span></td>
                  <td>{ticket.category_name}</td>
                  <td>{ticket.owner_name}</td>
                </tr>
              ))}
              {!recent.length && (
                <tr>
                  <td colSpan={5} className="muted">
                    No tickets yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;

