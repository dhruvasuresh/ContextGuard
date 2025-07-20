const express = require("express");
const { pgPool } = require("../db");
const authenticateJWT = require("../middleware/auth");
const { logAudit } = require("../services/auditLogger");
const policyEngine = require("../services/policyEngine");

const router = express.Router();

// Get all employees (protected)
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const result = await pgPool.query("SELECT * FROM employees");
    res.json(result.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch employees", details: err.message });
  }
});

// Get salary info for a specific employee (context-aware policy protected)
router.post("/:id/salary", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { purpose } = req.body;

  try {
    const result = await pgPool.query(
      "SELECT id, name, salary, department FROM employees WHERE id = $1",
      [id]
    );

    let logData = {
      user_id: req.user.id,
      action: "view_salary",
      resource: `employee_salary:${id}`,
      result: "",
      reason: "",
      ip_address: req.ip,
      purpose: purpose || null,
    };

    if (result.rows.length === 0) {
      logData.result = "denied";
      logData.reason = "Employee not found";
      await logAudit(logData);
      return res.status(404).json({ error: "Employee not found" });
    }

    // Context-aware policy check
    const context = {
      timestamp: new Date(),
      ip: req.ip,
    };

    const policyDecision = await policyEngine.evaluateAccess(
      req.user,
      "employee_salary",
      context,
      purpose
    );

    if (!policyDecision.allowed) {
      logData.result = "denied";
      logData.reason = policyDecision.reason || "Policy denied";
      await logAudit(logData);
      return res
        .status(403)
        .json({ error: "Access denied", reason: policyDecision.reason });
    }

    logData.result = "allowed";
    logData.reason = `Policy: ${policyDecision.policy}`;
    await logAudit(logData);

    // Transform the data to match frontend expectations
    const employee = result.rows[0];
    const baseSalary = parseFloat(employee.salary) || 0;
    const bonusPercentage = 15; // Default bonus percentage
    const totalCompensation = baseSalary * (1 + bonusPercentage / 100);

    const salaryData = {
      id: employee.id,
      name: employee.name,
      department: employee.department,
      base_salary: baseSalary,
      total_compensation: Math.round(totalCompensation),
      bonus_percentage: bonusPercentage,
      last_updated: new Date().toISOString(),
    };

    res.json(salaryData);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch salary info", details: err.message });
  }
});

// Update employee (protected)
router.put("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { name, email, department, position, salary, hire_date } = req.body;

  try {
    // Check if employee exists
    const checkResult = await pgPool.query(
      "SELECT id FROM employees WHERE id = $1",
      [id]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Update employee
    const result = await pgPool.query(
      "UPDATE employees SET name = $1, email = $2, department = $3, position = $4, salary = $5, hire_date = $6 WHERE id = $7 RETURNING *",
      [name, email, department, position, salary, hire_date, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update employee", details: err.message });
  }
});

// Delete employee (protected)
router.delete("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if employee exists
    const checkResult = await pgPool.query(
      "SELECT id FROM employees WHERE id = $1",
      [id]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Delete employee
    await pgPool.query("DELETE FROM employees WHERE id = $1", [id]);

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete employee", details: err.message });
  }
});

module.exports = router;
