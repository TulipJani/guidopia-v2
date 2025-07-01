var express = require('express');
const router = express.Router();

const CounselingRequest = require('../models/CounselingRequest');

router.post("/counseling-request", async (req, res) => {
  const { name, email, phone, status, message } = req.body;
  // Save to DB in the format shown in your image
  await CounselingRequest.create({
    student: { name, email, phone },
    status,
    message,
    requestedAt: new Date(),
  });
  res.status(201).json({ success: true });
});

module.exports = router;
