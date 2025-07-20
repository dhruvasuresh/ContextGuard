const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  policy_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  allow_if: {
    role: [String],
    time_range: String,
    weekdays_only: Boolean,
    from_office_ip: Boolean,
    purpose_required: Boolean
  },
  resource: { type: String, required: true },
  sensitivity: String
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;