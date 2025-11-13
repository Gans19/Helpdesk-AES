import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../providers/AuthProvider';

const TicketDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { setNotification } = useOutletContext();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [statusForm, setStatusForm] = useState({ status: '', priority: '', assignedTo: '' });
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTicket = async () => {
    const res = await api.get(`/tickets/${id}`);
    setTicket(res.data.data);
    setStatusForm({
      status: res.data.data.status,
      priority: res.data.data.priority,
      assignedTo: res.data.data.assigned_to || ''
    });
  };

  const loadComments = async () => {
    const res = await api.get(`/tickets/${id}/comments`);
    setComments(res.data.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await Promise.all([loadTicket(), loadComments()]);
      } catch (err) {
        setNotification({
          type: 'error',
          message: err.response?.data?.message || 'Failed to load ticket'
        });
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = (event) => {
    setStatusForm({
      ...statusForm,
      [event.target.name]: event.target.value
    });
  };

  const updateTicket = async () => {
    try {
      await api.put(`/tickets/${id}`, statusForm);
      setNotification({ type: 'success', message: 'Ticket updated' });
      await loadTicket();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update ticket'
      });
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();
    if (!commentBody.trim()) return;
    try {
      await api.post(`/tickets/${id}/comments`, { body: commentBody });
      setCommentBody('');
      await loadComments();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to add comment'
      });
    }
  };

  const renderComment = (comment) => (
    <li key={comment.id} className="comment-item">
      <div className="comment-meta">
        <strong>{comment.author_name}</strong> <span>{comment.author_email}</span>
        <time>{new Date(comment.created_at).toLocaleString()}</time>
      </div>
      <p>{comment.body}</p>
      {comment.replies?.length > 0 && (
        <ul className="comment-children">
          {comment.replies.map((reply) => renderComment(reply))}
        </ul>
      )}
    </li>
  );

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page">
        <p className="form-error">Ticket not found.</p>
      </div>
    );
  }

  const canManage = user.role === 'support' || user.role === 'admin';

  return (
    <div className="page">
      <header className="page-header">
        <h2>{ticket.title}</h2>
        <div className="badges">
          <span className={`badge status-${ticket.status}`}>{ticket.status}</span>
          <span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span>
          <span className="badge neutral">{ticket.category_name}</span>
        </div>
      </header>

      <section className="card ticket-detail">
        <h3>Description</h3>
        <p>{ticket.description}</p>
        <div className="meta-grid">
          <div>
            <h4>Owner</h4>
            <p>{ticket.owner_name}</p>
          </div>
          <div>
            <h4>Assigned to</h4>
            <p>{ticket.assignee_name || 'Unassigned'}</p>
          </div>
          <div>
            <h4>Created</h4>
            <p>{new Date(ticket.created_at).toLocaleString()}</p>
          </div>
          <div>
            <h4>Attachment</h4>
            {ticket.attachment ? (
              <a
                href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${ticket.attachment}`}
                target="_blank"
                rel="noreferrer"
              >
                Download
              </a>
            ) : (
              <p>None</p>
            )}
          </div>
        </div>
      </section>

      {canManage && (
        <section className="card form">
          <h3>Manage ticket</h3>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={statusForm.status} onChange={handleStatusChange}>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={statusForm.priority} onChange={handleStatusChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label htmlFor="assignedTo">Assigned user ID</label>
          <input
            id="assignedTo"
            name="assignedTo"
            value={statusForm.assignedTo || ''}
            onChange={handleStatusChange}
            placeholder="e.g. 2"
          />

          <button type="button" className="primary-btn" onClick={updateTicket}>
            Update ticket
          </button>
        </section>
      )}

      <section className="card">
        <h3>Comments</h3>
        <ul className="comment-list">
          {comments.map((comment) => renderComment(comment))}
          {!comments.length && <li className="muted">No comments yet.</li>}
        </ul>

        <form className="comment-form" onSubmit={submitComment}>
          <label htmlFor="comment">Add comment</label>
          <textarea
            id="comment"
            rows={3}
            value={commentBody}
            onChange={(event) => setCommentBody(event.target.value)}
            placeholder="Share an update..."
          />
          <button type="submit" className="primary-btn">
            Post comment
          </button>
        </form>
      </section>
    </div>
  );
};

export default TicketDetailPage;

