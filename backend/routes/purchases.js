const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

// Check if user has access to a module
router.post('/check-access', async (req, res) => {
  try {
    const { module, userId } = req.body;
    
    if (!userId) {
      return res.json({ hasAccess: false });
    }

    // Find any valid purchase (completed and not expired)
    const purchase = await Purchase.findOne({
      user: userId,
      status: 'completed',
      expiresAt: { $gt: new Date() }
    });

    res.json({ 
      hasAccess: !!purchase, // If any purchase exists, user has access to all modules
      expiresAt: purchase ? purchase.expiresAt : null
    });
  } catch (error) {
    console.error('Error in check-access:', error);
    res.status(500).json({ error: 'Failed to check access' });
  }
});

// Get user's purchased modules
router.get('/my-purchases/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const purchases = await Purchase.find({
      user: userId,
      status: 'completed'
    });

    res.json({ purchases });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

// Create a new purchase
router.post('/create', async (req, res) => {
  try {
    const { userId, module, amount, paymentId, orderId } = req.body;
    console.log('Creating purchase:', { userId, module, amount }); // Debug log

    if (!userId || !module || !amount || !paymentId || !orderId) {
      console.log('Missing required fields'); // Debug log
      return res.status(400).json({ error: 'All fields are required' });
    }

    const purchase = new Purchase({
      user: userId,
      module,
      amount,
      paymentId,
      orderId,
      status: 'completed'
    });

    await purchase.save();
    console.log('Purchase created:', purchase); // Debug log
    res.status(201).json({ purchase });
  } catch (error) {
    console.error('Error in create purchase:', error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// Add route to get user's active subscriptions
router.get('/active-subscriptions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const activePurchases = await Purchase.find({
      user: userId,
      status: 'completed',
      expiresAt: { $gt: new Date() }
    });

    res.json({ 
      subscriptions: activePurchases.map(purchase => ({
        module: purchase.module,
        expiresAt: purchase.expiresAt,
        daysRemaining: Math.ceil((purchase.expiresAt - new Date()) / (1000 * 60 * 60 * 24))
      }))
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

module.exports = router; 