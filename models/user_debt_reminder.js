const mongoose = require('mongoose')

const UserDebt = new mongoose.Schema({
  user_phone_number: {type: String, required: true},
  distributor_store_name: {type: String, required: true},
  total_amount: {type: String, required: true},
  message: { type: String, required: true },
  status: { type: String, required: true },
  expected_pay_date: { type: Date, default: Date.now(), required: true }
}, { timestamps: true })

module.exports = mongoose.model('user_debt', UserDebt)