const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  age: Number,
  gender: String,


            // Add these fields to your existing User schema
  purchasedCourses: { 
    type: [String], 
    default: [] 
  },
  
  phone: { 
    type: String, 
    required: false 
  },
  about: String,
  socialLinks: [{
    platform: String,
    url: String
  }],
  experience: [{
    title: String,
    company: String,
    description: String,
    startDate: String,
    endDate: String,
    current: { type: Boolean, default: false }
  }],
  skillsInProgress: [{
    name: String,
    progress: Number
  }],
  completionCertificates: [{
    name: String,
    organization: String
  }],
  personalityType: String,
  careerRecommendations: [String],
  skillRecommendations: [String],
  onboardingComplete: { type: Boolean, default: false },
  onboardingAnswers: {
    type: Map,
    of: String,
    default: {}
  },
  onboarding: { type: mongoose.Schema.Types.ObjectId, ref: 'Onboarding' },
  futureMeCard: { type: mongoose.Schema.Types.ObjectId, ref: 'FutureMeCard' },
    
    // Add these fields to your existing User schema
       
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  profilePic: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);
