import express from 'express';
import {
  submitContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact
} from '../controllers/contact.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateContact } from '../middleware/validation.middleware.js';

const router = express.Router();

// Public route
router.post('/', validateContact, submitContact);

// Admin routes
router.get('/', authenticateToken, getAllContacts);
router.get('/:id', authenticateToken, getContact);
router.patch('/:id/status', authenticateToken, updateContactStatus);
router.delete('/:id', authenticateToken, deleteContact);

export default router;

