const userModel = require('../models/userModel');

const me = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password_hash, ...safeUser } = user;

    return res.json({
      success: true,
      data: safeUser
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  me
};

