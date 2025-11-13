import PropTypes from 'prop-types';
import classNames from 'classnames';

const DashboardCard = ({ title, value, accent }) => (
  <div className={classNames('card', `card-${accent}`)}>
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  accent: PropTypes.oneOf(['open', 'progress', 'resolved', 'closed']).isRequired
};

export default DashboardCard;

