# BEPL Backend API

Backend API for Babu Erectors Pvt. Ltd. website with admin panel functionality.

## Features

- ✅ Contact form with email notifications (user confirmation + company notification)
- ✅ CRUD operations for Services, Projects, and About sections
- ✅ JWT-based admin authentication
- ✅ Secure API routes with middleware protection
- ✅ MongoDB database with Mongoose ODM
- ✅ Nodemailer for email services

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bepl

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
COMPANY_EMAIL=company@bepl.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Email Setup (Gmail)

For Gmail, you need to:
1. Enable 2-Step Verification
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASS`

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Using MongoDB service
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 5. Create Initial Admin User

Run this script to create the first admin user:

```bash
node scripts/createAdmin.js
```

Or manually create via MongoDB:

```javascript
// In MongoDB shell or Compass
use bepl
db.admins.insertOne({
  username: "admin",
  email: "admin@bepl.com",
  password: "$2a$12$...", // bcrypt hash of your password
  role: "superadmin",
  isActive: true
})
```

### 6. Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Public Endpoints

#### Contact
- `POST /api/contact` - Submit contact form

#### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service

#### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects?category=Steel Plants` - Get projects by category
- `GET /api/projects/:id` - Get single project

#### About
- `GET /api/about` - Get about content

### Admin Endpoints (Requires Authentication)

#### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin

#### Contact Management
- `GET /api/contact` - Get all contacts
- `GET /api/contact/:id` - Get single contact
- `PATCH /api/contact/:id/status` - Update contact status
- `DELETE /api/contact/:id` - Delete contact

#### Service Management
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

#### Project Management
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### About Management
- `PUT /api/about` - Update about content

#### Admin Management (Superadmin only)
- `GET /api/admin/admins` - Get all admins
- `POST /api/admin/admins` - Create new admin

## Authentication

Admin routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Frontend Integration

Add to your frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
backend/
├── models/          # Mongoose models
├── controllers/     # Route controllers
├── routes/          # API routes
├── middleware/      # Auth & validation middleware
├── services/        # Email service
├── uploads/         # File uploads (if needed)
└── server.js        # Main server file
```

## Security Notes

- Change `JWT_SECRET` in production
- Use strong passwords for admin accounts
- Enable HTTPS in production
- Regularly update dependencies
- Use environment variables for sensitive data

## License

Proprietary - Babu Erectors Pvt. Ltd.

