const { body } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must include an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must include a lowercase letter')
    .matches(/[0-9]/).withMessage('Password must include a digit')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must include a symbol'),
  body('role')
    .optional()
    .isIn(['user', 'support', 'admin'])
    .withMessage('Invalid role')
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required')
];

const refreshValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token required')
];

module.exports = {
  registerValidation,
  loginValidation,
  refreshValidation
};

