const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  result: { type: String, required: true }, // "allowed" or "denied"
  reason: { type: String },
  timestamp: { type: Date, default: Date.now },
  ip_address: { type: String },
  purpose: { type: String }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

async function logAudit({ user_id, action, resource, result, reason, ip_address, purpose }) {
  try {
    await AuditLog.create({
      user_id,
      action,
      resource,
      result,
      reason,
      ip_address,
      purpose
    });
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}

module.exports = { logAudit, AuditLog };