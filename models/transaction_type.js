const mongoose  = require("mongoose");

const transactionTypeSchema = new mongoose.Schema({
    name: {
            type: String,
            required: true
        },
    value: {
        type: String,
        required: true
    },
    ref_transaction_role: {
        type: String
    }
})

module.exports = mongoose.Schema("transaction_type", transactionTypeSchema);