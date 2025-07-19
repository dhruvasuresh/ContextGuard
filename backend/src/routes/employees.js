const express = require('express');
const { pgPool } = require('../db');
const authenticateJWT = require('../middleware/auth');
const {logAudit, AuditLog} = require('../services/auditLogger');

const router = express.Router();

// Get all employees (protected)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const result = await pgPool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees', details: err.message });
  }
});

// Get salary info for a specific employee (highly protected)
router.get('/:id/salary', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pgPool.query('SELECT id, name, salary, department FROM employees WHERE id = $1', [id]);
    let logData = {
      user_id: req.user.id,
      action: 'view_salary',
      resource: `employee_salary:${id}`,
      result: '',
      reason: '',
      ip_address: req.ip,
      purpose: req.body && req.body.purpose ? req.body.purpose : null
    };
    if (result.rows.length === 0) {
      logData.result = 'denied';
      logData.reason = 'Employee not found';
      await logAudit(logData);
      return res.status(404).json({ error: 'Employee not found' });
    }
    // In the future, add context-aware policy checks here!
    logData.result = 'allowed';
    logData.reason = 'role allowed';
    await logAudit(logData);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch salary info', details: err.message });
  }
});

// View audit logs (admin only)
router.get('/api/audit-logs', authenticateJWT, async (req, res) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs', details: err.message });
  }
});

module.exports = router;