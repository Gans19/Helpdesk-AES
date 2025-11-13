const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.get('/me', authenticate, userController.me);

module.exports = router;

