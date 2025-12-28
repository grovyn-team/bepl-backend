import express from 'express';
import {
  getAbout,
  updateAbout
} from '../controllers/about.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.get('/', getAbout);

// Admin route
router.put('/', authenticateToken, updateAbout);

export default router;

