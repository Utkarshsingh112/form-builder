const express = require('express');
const router = express.Router();
const Form = require('../models/form');

// Get all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single form
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create form
router.post('/', async (req, res) => {
  try {
    const form = new Form(req.body);
    const saved = await form.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update form
router.put('/:id', async (req, res) => {
  try {
    const updated = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete form
router.delete('/:id', async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: 'Form deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Duplicate form
router.post('/:id/duplicate', async (req, res) => {
  try {
    const original = await Form.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Form not found' });
    const duplicated = new Form({
      ...original.toObject(),
      _id: undefined,
      title: `${original.title} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined
    });
    const saved = await duplicated.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;