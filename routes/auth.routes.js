import express from 'express';
import {
  login,
  getCurrentAdmin
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateLogin } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/login', validateLogin, login);
router.get('/me', authenticateToken, getCurrentAdmin);

export default router;

