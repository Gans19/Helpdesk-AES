import PropTypes from 'prop-types';
import classNames from 'classnames';

const NotificationBanner = ({ type, message, onClose }) => (
  <div className={classNames('notification', `notification-${type}`)}>
    <span>{message}</span>
    <button type="button" onClick={onClose} aria-label="Close notification">
      ×
    </button>
  </div>
);

NotificationBanner.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'error']).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default NotificationBanner;

