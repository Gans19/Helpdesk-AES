const { verifyAccessToken } = require('../utils/jwt');
const userModel = require('../models/userModel');

module.exports = async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const payload = verifyAccessToken(token);
    const user = await userModel.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credential'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

