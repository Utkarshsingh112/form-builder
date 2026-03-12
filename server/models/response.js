const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: [
    {
      fieldId: { type: String, required: true },
      value: { type: mongoose.Schema.Types.Mixed }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Response', responseSchema);