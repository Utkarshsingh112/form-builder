const express = require('express');
const router = express.Router();
const Response = require('../models/response');

// Submit a response
router.post('/:formId/responses', async (req, res) => {
  try {
    const response = new Response({
      formId: req.params.formId,
      answers: req.body.answers
    });
    const saved = await response.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all responses for a form
router.get('/:formId/responses', async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId }).sort({ createdAt: -1 });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;