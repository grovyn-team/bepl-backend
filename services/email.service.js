import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  },
  // Add connection pool for better reliability
  pool: true,
  maxConnections: 1,
  maxMessages: 3
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service configuration error:', error);
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

// Send confirmation email to user
export const sendConfirmationEmail = async (contactData) => {
  const { name, email, subject, message } = contactData;

  const mailOptions = {
    from: `"BEPL" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank you for contacting BEPL',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f97316; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting BEPL</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for reaching out to Babu Erectors Pvt. Ltd. We have received your inquiry and our team will get back to you within 24 hours.</p>
              <p><strong>Your Inquiry Details:</strong></p>
              <ul>
                <li><strong>Subject:</strong> ${subject}</li>
                <li><strong>Message:</strong> ${message}</li>
              </ul>
              <p>If you have any urgent queries, please feel free to call us at <strong>+91 944 700 9417</strong>.</p>
              <p>Best regards,<br>BEPL Team</p>
            </div>
            <div class="footer">
              <p>Babu Erectors Pvt. Ltd.<br>
              A-201 Capital Corner, Adajan, Surat-395009, Gujarat, India</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    throw error;
  }
};

// Send notification email to company
export const sendNotificationEmail = async (contactData) => {
  const { name, email, phone, company, subject, message } = contactData;
  const companyEmail = process.env.COMPANY_EMAIL || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"BEPL Contact Form" <${process.env.EMAIL_USER}>`,
    to: companyEmail,
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f97316; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #f97316; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="info-box">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              <div class="info-box">
                <p><strong>Message:</strong></p>
                <p>${message}</p>
              </div>
              <p><em>Please respond to this inquiry within 24 hours.</em></p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Notification email sent to company:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    throw error;
  }
};

// Send career application confirmation email
export const sendCareerConfirmationEmail = async (careerData) => {
  const { name, email, position } = careerData;

  const mailOptions = {
    from: `"BEPL Careers" <${process.env.EMAIL_USER}>`,
    replyTo: process.env.EMAIL_USER || 'careers@bepl.com',
    to: email,
    subject: 'Application Received - BEPL Careers',
    // Add headers to improve deliverability
    headers: {
      'X-Priority': '3',
      'X-MSMail-Priority': 'Normal',
      'Importance': 'normal',
    },
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: #f9f9f9; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #f97316; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #fff; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #f97316; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Application Received</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your interest in BEPL</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for applying to the <strong>${position}</strong> position at Babu Erectors Pvt. Ltd. We have successfully received your application and resume.</p>
              
              <div class="info-box">
                <p style="margin: 0;"><strong>What happens next?</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Our HR team will review your application</li>
                  <li>If your profile matches our requirements, we will contact you within 7-10 business days</li>
                  <li>You will receive email updates on the status of your application</li>
                </ul>
              </div>

              <p>We appreciate your interest in joining our team and contributing to India's industrial growth. If you have any questions, please feel free to contact us at <strong>+91 944 700 9417</strong>.</p>
              
              <p>Best regards,<br><strong>BEPL HR Team</strong></p>
            </div>
            <div class="footer">
              <p><strong>Babu Erectors Pvt. Ltd.</strong><br>
              A-201 Capital Corner, Adajan, Surat-395009, Gujarat, India<br>
              Phone: +91 944 700 9417 | Email: careers@bepl.com</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Career confirmation email sent:', info.messageId);
    console.log('   To:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending career confirmation email:', error);
    console.error('   Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    // Don't throw error, just log it so the application can still be saved
    return { success: false, error: error.message };
  }
};

// Send career status update email
export const sendCareerStatusEmail = async (careerData) => {
  const { name, email, position, status } = careerData;

  const statusMessages = {
    shortlisted: {
      subject: 'Congratulations! Your Application Has Been Shortlisted',
      title: 'Application Shortlisted',
      message: `We are pleased to inform you that your application for the <strong>${position}</strong> position has been shortlisted. Our team will contact you shortly to schedule the next steps in our hiring process.`,
      color: '#10b981'
    },
    rejected: {
      subject: 'Update on Your Application - BEPL Careers',
      title: 'Application Status Update',
      message: `Thank you for your interest in the <strong>${position}</strong> position at BEPL. After careful consideration, we have decided to move forward with other candidates at this time. We encourage you to apply for future opportunities that match your skills and experience.`,
      color: '#ef4444'
    }
  };

  const statusInfo = statusMessages[status];
  if (!statusInfo) return;

  const mailOptions = {
    from: `"BEPL Careers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: statusInfo.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${statusInfo.color} 0%, ${status === 'shortlisted' ? '#059669' : '#dc2626'} 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: #f9f9f9; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-left: 4px solid ${statusInfo.color}; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #fff; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: ${statusInfo.color}; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">${statusInfo.title}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">BEPL Careers</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>${statusInfo.message}</p>
              
              ${status === 'shortlisted' ? `
              <div class="info-box">
                <p style="margin: 0;"><strong>Next Steps:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Our HR team will contact you within 3-5 business days</li>
                  <li>Please keep your documents ready for the interview process</li>
                  <li>Be prepared to discuss your experience and how you can contribute to BEPL</li>
                </ul>
              </div>
              ` : `
              <div class="info-box">
                <p style="margin: 0;">We appreciate the time you took to apply and encourage you to explore other opportunities with us in the future. We keep all applications on file and may contact you if a suitable position becomes available.</p>
              </div>
              `}

              <p>If you have any questions, please feel free to contact us at <strong>+91 944 700 9417</strong> or email us at careers@bepl.com.</p>
              
              <p>Best regards,<br><strong>BEPL HR Team</strong></p>
            </div>
            <div class="footer">
              <p><strong>Babu Erectors Pvt. Ltd.</strong><br>
              A-201 Capital Corner, Adajan, Surat-395009, Gujarat, India<br>
              Phone: +91 944 700 9417 | Email: careers@bepl.com</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Career ${status} email sent:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending career ${status} email:`, error);
    throw error;
  }
};

