const express = require('express');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/role');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const {
  createTicketValidation,
  updateTicketValidation,
  commentValidation
} = require('../validators/ticketValidators');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

router.use(authenticate);

router.get('/', ticketController.list);
router.post('/', upload.single('attachment'), createTicketValidation, validate, ticketController.create);

router.get('/:id', ticketController.getById);
router.put('/:id', upload.single('attachment'), updateTicketValidation, validate, ticketController.update);
router.delete('/:id', requireRole('admin'), ticketController.destroy);

router.get('/:id/comments', ticketController.listComments);
router.post('/:id/comments', commentValidation, validate, ticketController.addComment);

module.exports = router;

