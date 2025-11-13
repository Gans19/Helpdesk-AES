import PropTypes from 'prop-types';
import classNames from 'classnames';

const DashboardCard = ({ title, value, change, changeType, accent, showGraph = false }) => {
  const changeIcon = changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '';
  const changeClass = changeType === 'up' ? 'positive' : changeType === 'down' ? 'negative' : 'neutral';

  return (
    <div className={classNames('stat-card', accent === 'primary' ? 'stat-card-primary' : `stat-card-${accent}`)}>
      <div className="stat-header">
        <h3 className="stat-title">{title}</h3>
        {/* {change && (
          <div className={classNames('stat-change', changeClass)}>
            <span className="change-icon">{changeIcon}</span>
            <span className="change-text">{change}</span>
          </div>
        )} */}
      </div>
      <div className="stat-value">{value}</div>
      {showGraph && (
        <div className="stat-graph">
          <div className="graph-placeholder">
            <div className="graph-bar" style={{ height: '60%' }}></div>
            <div className="graph-bar" style={{ height: '80%' }}></div>
            <div className="graph-bar" style={{ height: '45%' }}></div>
            <div className="graph-bar" style={{ height: '90%' }}></div>
            <div className="graph-bar highlight" style={{ height: '100%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  changeType: PropTypes.oneOf(['up', 'down', 'neutral']),
  accent: PropTypes.oneOf(['open', 'progress', 'resolved', 'closed', 'primary']).isRequired,
  showGraph: PropTypes.bool
};

export default DashboardCard;

