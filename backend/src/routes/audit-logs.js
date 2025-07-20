const express = require("express");
const { AuditLog } = require("../services/auditLogger");
const authenticateJWT = require("../middleware/auth");

const router = express.Router();

// Get all audit logs with filtering (Admin/HR only)
router.get("/", authenticateJWT, async (req, res) => {
  try {
    // Check if user has permission to view audit logs
    if (!["Admin", "HR"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Admin or HR role required." });
    }

    const {
      action,
      user,
      resource,
      result,
      dateFrom,
      dateTo,
      limit = 100,
      page = 1,
    } = req.query;

    // Build filter object
    const filter = {};

    if (action) {
      filter.action = { $regex: action, $options: "i" };
    }

    if (user) {
      filter.user_id = { $regex: user, $options: "i" };
    }

    if (resource) {
      filter.resource = { $regex: resource, $options: "i" };
    }

    if (result) {
      filter.result = { $regex: result, $options: "i" };
    }

    if (dateFrom || dateTo) {
      filter.timestamp = {};
      if (dateFrom) {
        filter.timestamp.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.timestamp.$lte = new Date(dateTo + "T23:59:59.999Z");
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get logs with pagination
    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await AuditLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch audit logs", details: err.message });
  }
});

// Get audit logs for export (Admin only)
router.get("/export", authenticateJWT, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin role required for export." });
    }

    const { action, user, resource, result, dateFrom, dateTo } = req.query;

    // Build filter object
    const filter = {};

    if (action) {
      filter.action = { $regex: action, $options: "i" };
    }

    if (user) {
      filter.user_id = { $regex: user, $options: "i" };
    }

    if (resource) {
      filter.resource = { $regex: resource, $options: "i" };
    }

    if (result) {
      filter.result = { $regex: result, $options: "i" };
    }

    if (dateFrom || dateTo) {
      filter.timestamp = {};
      if (dateFrom) {
        filter.timestamp.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.timestamp.$lte = new Date(dateTo + "T23:59:59.999Z");
      }
    }

    // Get all logs matching filter (no pagination for export)
    const logs = await AuditLog.find(filter).sort({ timestamp: -1 }).lean();

    res.json(logs);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to export audit logs", details: err.message });
  }
});

// Get audit log statistics (Admin only)
router.get("/stats", authenticateJWT, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin role required." });
    }

    const { dateFrom, dateTo } = req.query;

    // Build date filter
    const dateFilter = {};
    if (dateFrom || dateTo) {
      dateFilter.timestamp = {};
      if (dateFrom) {
        dateFilter.timestamp.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.timestamp.$lte = new Date(dateTo + "T23:59:59.999Z");
      }
    }

    // Get statistics
    const [
      totalLogs,
      successLogs,
      failureLogs,
      actionStats,
      userStats,
      resourceStats,
    ] = await Promise.all([
      AuditLog.countDocuments(dateFilter),
      AuditLog.countDocuments({
        ...dateFilter,
        result: { $regex: "success", $options: "i" },
      }),
      AuditLog.countDocuments({
        ...dateFilter,
        result: { $regex: "failure|denied", $options: "i" },
      }),
      AuditLog.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$action", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AuditLog.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$user_id", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AuditLog.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$resource", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    res.json({
      totalLogs,
      successLogs,
      failureLogs,
      successRate:
        totalLogs > 0 ? ((successLogs / totalLogs) * 100).toFixed(2) : 0,
      actionStats,
      userStats,
      resourceStats,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch audit statistics",
      details: err.message,
    });
  }
});

// Get individual audit log (Admin/HR only)
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    // Check if user has permission
    if (!["Admin", "HR"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Admin or HR role required." });
    }

    const { id } = req.params;
    const log = await AuditLog.findById(id);

    if (!log) {
      return res.status(404).json({ error: "Audit log not found" });
    }

    res.json(log);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch audit log", details: err.message });
  }
});

module.exports = router;
