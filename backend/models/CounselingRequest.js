const mongoose = require('mongoose');

const CounselingRequestSchema = new mongoose.Schema({
  student: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  status: { type: String, default: 'pending' },
  message: { type: String },
  requestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CounselingRequest', CounselingRequestSchema);
