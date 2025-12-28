import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Contact form validation
export const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  handleValidationErrors
];

// Service validation
export const validateService = [
  body('id').trim().notEmpty().withMessage('Service ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  handleValidationErrors
];

// Project validation
export const validateProject = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('client').trim().notEmpty().withMessage('Client is required'),
  body('category').isIn(['Steel Plants', 'Power Plants', 'Refineries', 'Infrastructure']).withMessage('Invalid category'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  handleValidationErrors
];

// Admin login validation
export const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

