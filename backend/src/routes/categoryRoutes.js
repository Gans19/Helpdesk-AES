const express = require('express');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/role');
const validate = require('../middleware/validate');
const { createCategoryValidation, updateCategoryValidation } = require('../validators/categoryValidators');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', authenticate, categoryController.list);
router.post('/', authenticate, requireRole('admin'), createCategoryValidation, validate, categoryController.create);
router.put('/:id', authenticate, requireRole('admin'), updateCategoryValidation, validate, categoryController.update);
router.delete('/:id', authenticate, requireRole('admin'), categoryController.destroy);

module.exports = router;

