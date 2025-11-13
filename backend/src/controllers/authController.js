const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const { matchedData } = require('express-validator');
const userModel = require('../models/userModel');
const refreshTokenModel = require('../models/refreshTokenModel');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { hashToken } = require('../utils/tokenHash');
const config = require('../config/config');

const buildAuthResponse = async (user) => {
  const accessToken = signAccessToken(user);
  const jti = uuid();
  const refreshToken = signRefreshToken(user, jti);
  const tokenHash = hashToken(refreshToken);
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await refreshTokenModel.createToken({
    userId: user.id,
    tokenHash,
    expiresAt: expires
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.accessExpiry,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};

const register = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const existing = await userModel.findByEmail(data.email);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const created = await userModel.createUser({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || 'user'
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: created
      }
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const user = await userModel.findByEmail(data.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const valid = await bcrypt.compare(data.password, user.password_hash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const payload = await buildAuthResponse(user);

    return res.json({
      success: true,
      message: 'Login successful',
      data: payload
    });
  } catch (error) {
    return next(error);
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = matchedData(req);
    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashToken(refreshToken);
    const stored = await refreshTokenModel.findByTokenHash(tokenHash);

    if (!stored || stored.user_id !== payload.sub) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    await refreshTokenModel.deleteByTokenHash(tokenHash);

    const user = await userModel.findById(payload.sub);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const data = await buildAuthResponse(user);

    return res.json({
      success: true,
      message: 'Token refreshed',
      data
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

module.exports = {
  register,
  login,
  refresh
};

