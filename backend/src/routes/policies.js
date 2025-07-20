const express = require('express');
const Policy = require('../models/Policy');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

// Admin-only middleware
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
}

// Get all policies (admin only)
router.get('/', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const policies = await Policy.find().sort({ policy_id: 1 });
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch policies', details: err.message });
  }
});

// Get a specific policy by ID (admin only)
router.get('/:id', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const policy = await Policy.findOne({ policy_id: req.params.id });
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch policy', details: err.message });
  }
});

// Create a new policy (admin only)
router.post('/', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { policy_id, name, allow_if, resource, sensitivity } = req.body;
    if (!policy_id || !name || !allow_if || !resource) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existingPolicy = await Policy.findOne({ policy_id });
    if (existingPolicy) {
      return res.status(409).json({ error: 'Policy ID already exists' });
    }
    const newPolicy = new Policy({
      policy_id,
      name,
      allow_if,
      resource,
      sensitivity
    });
    await newPolicy.save();
    res.status(201).json(newPolicy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create policy', details: err.message });
  }
});

// Update a policy (admin only)
router.put('/:id', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const { name, allow_if, resource, sensitivity } = req.body;
    const updatedPolicy = await Policy.findOneAndUpdate(
      { policy_id: req.params.id },
      { name, allow_if, resource, sensitivity },
      { new: true, runValidators: true }
    );
    if (!updatedPolicy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    res.json(updatedPolicy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update policy', details: err.message });
  }
});

// Delete a policy (admin only)
router.delete('/:id', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const deletedPolicy = await Policy.findOneAndDelete({ policy_id: req.params.id });
    if (!deletedPolicy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    res.json({ message: 'Policy deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete policy', details: err.message });
  }
});

module.exports = router; 