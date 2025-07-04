const express = require('express');
const User = require('../models/User');
const Onboarding = require('../models/Onboarding');
const FutureMeCard = require('../models/FutureMeCard');
const router = express.Router();

// Middleware to check authentication
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
}

// Test endpoint to check if route is accessible
router.get('/test', (req, res) => {
  res.json({ message: 'User route is accessible', authenticated: req.isAuthenticated() });
});

// Onboarding question (POST)
router.post('/onboarding', ensureAuth, async (req, res) => {
  // Save onboarding data
  await User.findByIdAndUpdate(req.user.id, {
    onboardingComplete: true,
    onboarding: req.body.onboardingId,
    // ...other onboarding fields from req.body
  });
  res.json({ success: true });
});

// Get current user
router.get('/me', ensureAuth, (req, res) => {
  res.json(req.user);
});

// Get user profile data
router.get('/profile', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-googleId -onboardingAnswers')
      .populate({
        path: 'onboarding',
        model: 'Onboarding',
        select: 'phoneNumber studentType schoolClass schoolStream strongestAreas learningFormats motivation futureExcitement collegeYear collegeDegree otherDegree strengths careerGoals industries lifestyle learningPreference joiningReason otherReason completedAt'
      })
      .populate({
        path: 'futureMeCard',
        model: 'FutureMeCard',
        select: 'futureRole tagline tags mindset salary keySkills mentors cta personalityType careerRecommendations skillRecommendations'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Update user profile data
router.put('/profile', ensureAuth, async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      about,
      socialLinks,
      experience,
      skillsInProgress,
      completionCertificates,
      personalityType,
      careerRecommendations,
      skillRecommendations,
      profilePic
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        age,
        gender,
        about,
        socialLinks,
        experience,
        skillsInProgress,
        completionCertificates,
        personalityType,
        careerRecommendations,
        skillRecommendations,
        ...(profilePic !== undefined && { profilePic })
      },
      { new: true, runValidators: true }
    ).select('-googleId -onboardingAnswers');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
