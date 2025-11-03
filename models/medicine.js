const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  schedule: {
    type: String, 
    required: true,
  },
  notes: String,
 
});

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;
