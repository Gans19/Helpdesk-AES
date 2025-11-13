const { body } = require('express-validator');

const createCategoryValidation = [
  body('name').trim().notEmpty().withMessage('Name required').isLength({ max: 120 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 255 })
];

const updateCategoryValidation = [
  body('name').trim().notEmpty().withMessage('Name required').isLength({ max: 120 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 255 })
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation
};

