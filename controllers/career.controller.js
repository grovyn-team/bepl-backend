import Career from '../models/Career.model.js';
import { sendCareerConfirmationEmail, sendCareerStatusEmail } from '../services/email.service.js';
import https from 'https';
import http from 'http';

// Submit career application
export const submitApplication = async (req, res) => {
  try {
    const { name, email, phone, position, experience, coverLetter } = req.body;

    if (!req.cloudinaryResult || !req.cloudinaryResult.secure_url) {
      return res.status(400).json({
        success: false,
        message: 'Resume upload is required'
      });
    }

    // Create career application
    const application = new Career({
      name,
      email,
      phone,
      position,
      experience,
      coverLetter,
      resume: req.cloudinaryResult.secure_url
    });

    await application.save();

    // Send confirmation email
    try {
      const emailResult = await sendCareerConfirmationEmail({
        name,
        email,
        position
      });
      if (emailResult.success) {
        application.emailSent = true;
        await application.save();
        console.log(`✅ Confirmation email sent to ${email}`);
      } else {
        console.warn(`⚠️ Email sending failed for ${email}:`, emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
      // Don't fail the request if email fails - application is still saved
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. We will review your application and get back to you soon.',
      data: {
        id: application._id
      }
    });
  } catch (error) {
    console.error('Career application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

// Get all applications (Admin only)
export const getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    const applications = await Career.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Career.countDocuments(query);

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

// Get single application (Admin only)
export const getApplication = async (req, res) => {
  try {
    const application = await Career.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: error.message
    });
  }
};

// Proxy PDF from Cloudinary to avoid CORS issues
export const getResumePDF = async (req, res) => {
  try {
    const application = await Career.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const pdfUrl = application.resume;
    
    // Set CORS headers to allow PDF.js to fetch
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${application.name.replace(/\s+/g, '_')}_resume.pdf"`);

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Determine if URL is HTTPS or HTTP
    const url = new URL(pdfUrl);
    const client = url.protocol === 'https:' ? https : http;

    // Fetch PDF from Cloudinary and pipe to response
    client.get(pdfUrl, (pdfRes) => {
      // Set additional headers from Cloudinary response
      if (pdfRes.headers['content-type']) {
        res.setHeader('Content-Type', pdfRes.headers['content-type']);
      }
      if (pdfRes.headers['content-length']) {
        res.setHeader('Content-Length', pdfRes.headers['content-length']);
      }

      // Handle errors
      pdfRes.on('error', (error) => {
        console.error('Error fetching PDF:', error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Failed to fetch PDF'
          });
        }
      });

      // Pipe PDF data to response
      pdfRes.pipe(res);
    }).on('error', (error) => {
      console.error('Error making request to Cloudinary:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch PDF from Cloudinary'
        });
      }
    });
  } catch (error) {
    console.error('Error in getResumePDF:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch PDF',
        error: error.message
      });
    }
  }
};

// Update application status (Admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, shortlisted, or rejected'
      });
    }

    const application = await Career.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Send status update email
    try {
      await sendCareerStatusEmail({
        name: application.name,
        email: application.email,
        position: application.position,
        status
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Application status updated',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update application',
      error: error.message
    });
  }
};

// Delete application (Admin only)
export const deleteApplication = async (req, res) => {
  try {
    const application = await Career.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete application',
      error: error.message
    });
  }
};
