const config = require('../config/config');

module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.status || 500;
  const payload = {
    success: false,
    message: err.message || 'Something went wrong',
    errors: err.errors || []
  };

  if (!config.isProduction) {
    console.error(err);
  }

  return res.status(statusCode).json(payload);
};

