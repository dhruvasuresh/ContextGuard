const Policy = require('../models/Policy');

class PolicyEngine {
  async getPoliciesForResource(resource) {
    return Policy.find({ resource });
  }

  async evaluateAccess(user, resource, context, purpose) {
    const policies = await this.getPoliciesForResource(resource);
    for (const policy of policies) {
      if (this.checkPolicy(user, policy, context, purpose)) {
        return { allowed: true, policy: policy.policy_id };
      }
    }
    return { allowed: false, reason: 'No matching policy' };
  }

  checkPolicy(user, policy, context, purpose) {
    return (
      this.checkRole(user.role, policy.allow_if.role) &&
      this.checkTimeRange(context.timestamp, policy.allow_if.time_range) &&
      this.checkWeekdaysOnly(context.timestamp, policy.allow_if.weekdays_only) &&
      this.checkIP(context.ip, policy.allow_if.from_office_ip) &&
      this.checkPurpose(purpose, policy.allow_if.purpose_required)
    );
  }

  checkRole(userRole, allowedRoles) {
    return allowedRoles.includes(userRole);
  }

  checkTimeRange(timestamp, timeRange) {
    if (!timeRange) return true;
    const [start, end] = timeRange.split('-');
    const now = new Date(timestamp);
    const current = now.getHours() + now.getMinutes() / 60;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startTime = startH + startM / 60;
    const endTime = endH + endM / 60;
    return current >= startTime && current <= endTime;
  }

  checkWeekdaysOnly(timestamp, weekdaysOnly) {
    if (!weekdaysOnly) return true;
    const day = new Date(timestamp).getDay();
    return day >= 1 && day <= 5; // 1=Monday, 5=Friday
  }

  checkIP(ip, fromOfficeIP) {
    if (!fromOfficeIP) return true;
    // Replace with your office IP logic
    const officeIPs = ['127.0.0.1']; // Example
    return officeIPs.includes(ip);
  }

  checkPurpose(purpose, required) {
    if (!required) return true;
    return typeof purpose === 'string' && purpose.trim().length > 0;
  }
}

module.exports = new PolicyEngine();