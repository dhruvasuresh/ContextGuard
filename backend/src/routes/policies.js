const express = require("express");
const Policy = require("../models/Policy");
const authenticateJWT = require("../middleware/auth");
const { logAudit } = require("../services/auditLogger");

const router = express.Router();

// Get all policies (Admin only)
router.get("/", authenticateJWT, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin role required." });
    }

    const policies = await Policy.find({}).sort({ resource: 1, policy_id: 1 });
    res.json(policies);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch policies", details: err.message });
  }
});

// Get individual policy by ID (Admin only)
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin role required." });
    }

    const { id } = req.params;
    const policy = await Policy.findOne({ policy_id: id });

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    res.json(policy);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch policy", details: err.message });
  }
});

// Create new policy (Admin only)
router.post("/", authenticateJWT, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin role required." });
    }

    const { policy_id, name, resource, sensitivity, allow_if } = req.body;

    // Validate required fields
    if (!policy_id || !name || !resource || !allow_if) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if policy already exists
    const existingPolicy = await Policy.findOne({ policy_id });
    if (existingPolicy) {
      return res
        .status(409)
        .json({ error: "Policy with this ID already exists" });
    }

    // Create new policy
    const policy = new Policy({
      policy_id,
      name,
      resource,
      sensitivity,
      allow_if,
    });

    await policy.save();

    // Log the action
    await logAudit({
      user_id: req.user.id,
      action: "create_policy",
      resource: `policy:${policy_id}`,
      result: "success",
      reason: `Created policy: ${name}`,
      ip_address: req.ip,
    });

    res.status(201).json(policy);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create policy", details: err.message });
  }
});

// Update policy (Admin only)
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin role required." });
    }

    const { id } = req.params;
    const updateData = req.body;

    const policy = await Policy.findOneAndUpdate(
      { policy_id: id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    // Log the action
    await logAudit({
      user_id: req.user.id,
      action: "update_policy",
      resource: `policy:${id}`,
      result: "success",
      reason: `Updated policy: ${policy.name}`,
      ip_address: req.ip,
    });

    res.json(policy);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update policy", details: err.message });
  }
});

// Delete policy (Admin only)
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin role required." });
    }

    const { id } = req.params;

    const policy = await Policy.findOneAndDelete({ policy_id: id });

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    // Log the action
    await logAudit({
      user_id: req.user.id,
      action: "delete_policy",
      resource: `policy:${id}`,
      result: "success",
      reason: `Deleted policy: ${policy.name}`,
      ip_address: req.ip,
    });

    res.json({ message: "Policy deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete policy", details: err.message });
  }
});

// Get policies by resource
router.get("/resource/:resource", authenticateJWT, async (req, res) => {
  try {
    const { resource } = req.params;
    const policies = await Policy.find({ resource }).sort({ policy_id: 1 });
    res.json(policies);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch policies", details: err.message });
  }
});

module.exports = router;
