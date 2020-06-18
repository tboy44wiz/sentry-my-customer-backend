const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Complaint = new mongoose.Schema({
  user_ref_id: { type: Schema.Types.ObjectId, ref: 'user' }, 
  message: { type: String, required: true},
  store_ref_code: { type: Schema.Types.ObjectId, ref: 'store' }
}, { timestamps: true })

module.exports = mongoose.model('complaint', Complaint)