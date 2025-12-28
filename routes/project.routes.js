import express from 'express';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateProject } from '../middleware/validation.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProject);

// Admin routes
router.post('/', authenticateToken, validateProject, createProject);
router.put('/:id', authenticateToken, validateProject, updateProject);
router.delete('/:id', authenticateToken, deleteProject);

export default router;

