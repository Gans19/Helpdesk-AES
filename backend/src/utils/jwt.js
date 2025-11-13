const jwt = require('jsonwebtoken');
const config = require('../config/config');

const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email
    },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiry }
  );

const signRefreshToken = (user, jti) =>
  jwt.sign(
    {
      sub: user.id,
      jti
    },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiry }
  );

const verifyAccessToken = (token) =>
  jwt.verify(token, config.jwt.accessSecret);

const verifyRefreshToken = (token) =>
  jwt.verify(token, config.jwt.refreshSecret);

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};

