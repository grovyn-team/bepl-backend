import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  resume: {
    type: String,
    required: [true, 'Resume is required'],
    trim: true
  },
  coverLetter: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'rejected'],
    default: 'pending'
  },
  emailSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Career', careerSchema);

