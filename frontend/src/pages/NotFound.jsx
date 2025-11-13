import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="auth-layout">
    <div className="auth-card">
      <h1>404</h1>
      <p className="muted">The page you requested could not be found.</p>
      <Link to="/" className="primary-btn">
        Back to dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;

