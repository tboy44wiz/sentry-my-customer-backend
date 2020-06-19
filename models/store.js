const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Store = new mongoose.Schema({
  store_ref_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "store"
  },
  store_name: {
      type: String,
      required: true
    },
    Phone_number: {
      type: String,
      required: true
    },
    tagline: {
      type: String,
      required: true
    },
    shop_address: {
      type: String,
      required: true
    },
    email: String
}, { timestamps: true })

module.exports = mongoose.model('store', Store)