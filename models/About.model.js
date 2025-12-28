import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    trim: true
  },
  heroDescription: {
    type: String,
    trim: true
  },
  aboutContent: {
    type: String,
    trim: true
  },
  vision: {
    type: String,
    trim: true
  },
  mission: {
    type: String,
    trim: true
  },
  values: [{
    icon: String,
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  milestones: [{
    year: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  certifications: [{
    type: String,
    trim: true
  }],
  teamStats: {
    engineers: {
      type: Number,
      default: 103
    },
    supervisors: {
      type: Number,
      default: 209
    },
    technicians: {
      type: Number,
      default: 3000
    },
    yearsExperience: {
      type: Number,
      default: 40
    }
  },
  mdMessage: {
    name: String,
    position: String,
    message: String
  }
}, {
  timestamps: true
});

export default mongoose.model('About', aboutSchema);

