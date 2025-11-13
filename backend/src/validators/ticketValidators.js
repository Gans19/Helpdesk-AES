const { body } = require('express-validator');

const createTicketValidation = [
  body('title').trim().notEmpty().withMessage('Title required').isLength({ max: 191 }),
  body('description').trim().notEmpty().withMessage('Description required'),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('categoryId').isInt().withMessage('Valid categoryId required')
];

const updateTicketValidation = [
  body('title').optional().trim().isLength({ min: 1, max: 191 }),
  body('description').optional().trim().isLength({ min: 1 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed']),
  body('assignedTo').optional({ nullable: true }).isInt().withMessage('assignedTo must be numeric')
];

const commentValidation = [
  body('body').trim().notEmpty().withMessage('Comment body required').isLength({ max: 2000 }),
  body('parentCommentId').optional({ nullable: true }).isInt().withMessage('parentCommentId must be numeric')
];

module.exports = {
  createTicketValidation,
  updateTicketValidation,
  commentValidation
};

