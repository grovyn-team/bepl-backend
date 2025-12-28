import express from 'express';
import Admin from '../models/Admin.model.js';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.middleware.js';

const router = express.Router();

// Get all admins (Superadmin only)
router.get('/admins', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins',
      error: error.message
    });
  }
});

// Create admin (Superadmin only)
router.post('/admins', 
  authenticateToken, 
  requireSuperAdmin,
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const admin = new Admin(req.body);
      await admin.save();
      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to create admin',
        error: error.message
      });
    }
  }
);

export default router;

