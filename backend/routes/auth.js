const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user.onboardingComplete) {
      // res.redirect('http://localhost:5173/onboarding');
      res.redirect('https://guidopia-v2.vercel.app.app//onboarding');

    } else {
      // res.redirect('http://localhost:5173/dashboard');
      res.redirect('https://guidopia-v2.vercel.app.app/dashboard');
    }
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// No specific server-side logic needed for logout with JWT, 
// but an endpoint can be useful for client-side state management.
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
