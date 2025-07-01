const express = require('express');
const razorpay = require('../config/razorpay');
const Purchase = require('../models/Purchase');
const User = require('../models/User');
const crypto = require('crypto');
const router = express.Router();

// Map plan IDs to module access
const PLAN_MODULE_MAP = {
  'standard': 'all-modules',    
  'premium': 'all-modules',     
  'counseling': 'counseling'    
};

router.post('/create-order', async (req, res) => {
  const { amount, courseId } = req.body;
  const receipt = `rcpt_${courseId}_${Date.now()}`.slice(0, 40);
  const options = {
    amount: amount * 100, // amount in paise
    currency: "INR",
    receipt,
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency, 
      key: process.env.RAZORPAY_KEY_ID 
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Payment verification route
// Payment verification route
router.post('/verify', async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature, 
    courseId, 
    courseName, 
    amount,
    userId,  // ✅ ADD THIS
    phone    // ✅ ADD THIS
  } = req.body;

  // Verify signature
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Store purchase in DB with CORRECT field names
  try {
    const purchase = new Purchase({
      user: req.user._id,
      module: 'all-modules',        // ✅ FIXED: use 'module' not 'courseId'
      amount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      phone: phone || '9999999999',  // ✅ FIXED: add required phone field
      status: 'completed'            // ✅ FIXED: use 'completed' not 'paid'
    });
    await purchase.save();

    // Update user
    await User.findByIdAndUpdate(req.user._id, { 
      $addToSet: { purchasedCourses: courseId }
    });

    res.json({ success: true, purchase });
  } catch (err) {
    console.error('Purchase save error:', err);
    res.status(500).json({ error: 'Failed to save purchase' });
  }
});

// Check if user has active subscription
router.get('/check-subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const activePurchase = await Purchase.findOne({
      user: userId,
      status: 'completed',
      expiresAt: { $gt: new Date() }
    });

    res.json({
      hasActiveSubscription: !!activePurchase,
      expiresAt: activePurchase ? activePurchase.expiresAt : null,
      module: activePurchase ? activePurchase.module : null
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ error: 'Failed to check subscription' });
  }
});

module.exports = router;