const express = require('express');
const { registerValidation, loginValidation, refreshValidation } = require('../validators/authValidators');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validate, authController.register);
router.post('/login', authLimiter, loginValidation, validate, authController.login);
router.post('/refresh', refreshValidation, validate, authController.refresh);

module.exports = router;

