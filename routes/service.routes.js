import express from 'express';
import {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/service.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateService } from '../middleware/validation.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.get('/:id', getService);

// Admin routes
router.post('/', authenticateToken, validateService, createService);
router.put('/:id', authenticateToken, validateService, updateService);
router.delete('/:id', authenticateToken, deleteService);

export default router;

