import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TicketsListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get('/tickets');
        setTickets(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Tickets</h2>
          <p className="muted">Manage support requests.</p>
        </div>
        <div className="actions">
          <Link to="/tickets/new" className="primary-btn">
            New ticket
          </Link>
        </div>
      </header>

      {error && <div className="form-error">{error}</div>}

      <div className="card">
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
                <th>Assigned</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td><span className={`badge status-${ticket.status}`}>{ticket.status}</span></td>
                  <td><span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span></td>
                  <td>{ticket.category_name}</td>
                  <td>{ticket.owner_name}</td>
                  <td>{ticket.assignee_name || '—'}</td>
                  <td>
                    <Link to={`/tickets/${ticket.id}`} className="link-btn">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {!tickets.length && (
                <tr>
                  <td colSpan={7} className="muted">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsListPage;

