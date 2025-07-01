const Purchase = require('../models/Purchase');

const checkModuleAccess = (module) => async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const purchase = await Purchase.findOne({
      user: userId,
      $or: [
        { module: module },
        { module: 'all-modules' }
      ],
      status: 'completed'
    });

    if (!purchase) {
      return res.status(403).json({ error: 'Access denied. Please purchase this module first.' });
    }

    next();
  } catch (error) {
    console.error('Error checking module access:', error);
    res.status(500).json({ error: 'Failed to verify access' });
  }
};

module.exports = checkModuleAccess; 