const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const fieldSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  type: { type: String, enum: ['text', 'dropdown', 'checkbox', 'radio'], required: true },
  label: { type: String, required: true },
  options: [String],
  required: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  fields: [fieldSchema],
  style: {
    primaryColor: { type: String, default: '#6366f1' },
    fontFamily: { type: String, default: 'Inter' },
    alignment: { type: String, default: 'left' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);

