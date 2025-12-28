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

/**
 * Upload image to Cloudinary
 * @param {Buffer|string} file - File buffer or file path
 * @param {string} folder - Cloudinary folder path
 * @param {object} options - Additional upload options
 * @returns {Promise<object>} Upload result with secure_url
 */
export const uploadImage = async (file, folder = 'bepl', options = {}) => {
  try {
    const uploadOptions = {
      folder: `bepl/${folder}`,
      resource_type: 'auto',
      ...options,
    };

    let result;
    if (Buffer.isBuffer(file)) {
      // Upload from buffer
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(file).pipe(uploadStream);
      });
    } else if (typeof file === 'string') {
      // Upload from URL or file path
      result = await cloudinary.uploader.upload(file, uploadOptions);
    } else {
      throw new Error('Invalid file format');
    }

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} Deletion result
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} Public ID
 */
export const extractPublicId = (url) => {
  if (!url) return null;
  const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/i);
  return matches ? matches[1] : null;
};

export default cloudinary;

