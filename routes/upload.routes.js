import express from 'express';
import { upload, uploadToCloudinary } from '../middleware/upload.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { uploadImage } from '../services/cloudinary.service.js';

const router = express.Router();

// Upload single image (Admin only)
router.post(
  '/image',
  authenticateToken,
  upload.single('image'),
  uploadToCloudinary,
  (req, res) => {
    if (!req.cloudinaryResult) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded',
      });
    }

    res.json({
      success: true,
      data: {
        url: req.cloudinaryResult.secure_url,
        public_id: req.cloudinaryResult.public_id,
        width: req.cloudinaryResult.width,
        height: req.cloudinaryResult.height,
      },
    });
  }
);

// Upload multiple images (Admin only)
router.post(
  '/images',
  authenticateToken,
  upload.array('images', 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images uploaded',
        });
      }

      const folder = req.body.folder || 'general';
      const { Readable } = await import('stream');
      const { v2: cloudinary } = await import('cloudinary');
      
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = Readable.from(file.buffer);
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `bepl/${folder}`,
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
              });
            }
          );
          stream.pipe(uploadStream);
        });
      });

      const results = await Promise.all(uploadPromises);

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to upload images',
      });
    }
  }
);

export default router;

