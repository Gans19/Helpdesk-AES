import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const ProtectedRoute = ({ roles, children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired
};

ProtectedRoute.defaultProps = {
  roles: null
};

export default ProtectedRoute;

