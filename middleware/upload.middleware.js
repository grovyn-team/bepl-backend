import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const pdfFilter = (req, file, cb) => {
  // Accept PDFs only
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: imageFilter,
});

export const uploadPDF = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: pdfFilter,
});

// Middleware to upload to Cloudinary after multer
export const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const folder = req.body.folder || 'general';
    
    // Convert buffer to stream for Cloudinary
    const stream = Readable.from(req.file.buffer);
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `bepl/${folder}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    // Attach Cloudinary result to request
    req.cloudinaryResult = {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
    req.body.image = result.secure_url; // Set image URL in body

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to upload image',
    });
  }
};

// Middleware to upload PDF to Cloudinary
export const uploadPDFToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }

    const folder = 'careers';
    
    // Convert buffer to stream for Cloudinary
    const stream = Readable.from(req.file.buffer);
    
    // Upload to Cloudinary as raw file
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `bepl/${folder}`,
          resource_type: 'raw',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    // Attach Cloudinary result to request
    req.cloudinaryResult = {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
    };

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to upload resume',
    });
  }
};
