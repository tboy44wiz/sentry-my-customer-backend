const mongoose = require('mongoose')

const DebtReminder = new mongoose.Schema({
  ts_ref_id: { type: Schema.Types.ObjectId, ref: 'transaction' },
  message: { type: String, required: true },
  status: { type: String, required: true },
  expected_pay_date: { type: Date, default: Date.now }
}, { timestamps: true })

module.exports = mongoose.model('debt_reminder', DebtReminder)