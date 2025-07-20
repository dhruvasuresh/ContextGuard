const express = require('express');
const { pgPool } = require('../db');
const authenticateJWT = require('../middleware/auth');
const { logAudit } = require('../services/auditLogger');
const policyEngine = require('../services/policyEngine');

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

// Get salary info for a specific employee (context-aware policy protected)
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
    // Context-aware policy check
    const context = {
      timestamp: new Date(),
      ip: req.ip
    };
    const purpose = req.body && req.body.purpose ? req.body.purpose : null;
    const policyDecision = await policyEngine.evaluateAccess(req.user, 'employee_salary', context, purpose);
    if (!policyDecision.allowed) {
      logData.result = 'denied';
      logData.reason = policyDecision.reason || 'Policy denied';
      await logAudit(logData);
      return res.status(403).json({ error: 'Access denied', reason: policyDecision.reason });
    }
    logData.result = 'allowed';
    logData.reason = `Policy: ${policyDecision.policy}`;
    await logAudit(logData);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch salary info', details: err.message });
  }
});

module.exports = router;