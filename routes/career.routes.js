import express from 'express';
import { 
  submitApplication, 
  getAllApplications, 
  getApplication, 
  getResumePDF,
  updateApplicationStatus, 
  deleteApplication 
} from '../controllers/career.controller.js';
import { uploadPDF, uploadPDFToCloudinary } from '../middleware/upload.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route - submit application
router.post('/', uploadPDF.single('resume'), uploadPDFToCloudinary, submitApplication);

// Admin routes
router.get('/', authenticateToken, getAllApplications);
router.get('/:id', authenticateToken, getApplication);
// Resume PDF proxy - needs to be before /:id/status to avoid route conflict
router.get('/:id/resume', authenticateToken, getResumePDF);
router.patch('/:id/status', authenticateToken, updateApplicationStatus);
router.delete('/:id', authenticateToken, deleteApplication);

export default router;

