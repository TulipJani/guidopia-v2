const express = require('express');
const router = express.Router();
const { generateFutureMeFromStepper } = require('../utils/futureMeGemini');

router.post('/generate', async (req, res) => {
  try {
    const stepperData = req.body;
    const card = await generateFutureMeFromStepper(stepperData);
    res.json({ data: card });
  } catch (error) {
    console.error('Error in Future Me Stepper generation:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to generate Future Me card from stepper data'
    });
  }
});

module.exports = router; 