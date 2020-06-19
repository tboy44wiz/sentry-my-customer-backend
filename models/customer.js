const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Customer = mongoose.Schema({
  store_ref_code: { type: Schema.Types.ObjectId, ref: 'store' },
  name: { type: String, required: true},
  phone_number: { type: Number, required: true}
}, { timestamps: true})

module.exports = mongoose.model('customer', Customer)