const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Store = new mongoose.Schema({
  store_name: { type: String, required: true },
  Phone_number: { type: Number, required: true }, 
  tagline: { type: String, required: true},
  shop_address: { type: String, required: true }, 
  email: String
}, { timestamps: true })

module.exports = mongoose.model('store', Store)