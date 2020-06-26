const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//feature/view-all-transaction

const Transaction = new mongoose.Schema({
	// Object name to be updated 
	customer_ref_id: {
		type: Schema.Types.ObjectId,
		ref: 'customer',
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	interest: {
		type: Number,
		required: true
	},
	total_amount: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	transaction_name: {
        type: String,
        required: true
    },
    transaction_role: {
        type: String,
		required: true
    },
	user_ref_id: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	store_ref_id: {
		type: Schema.Types.ObjectId,
		ref: 'store',
		required: true
	}
}, { timestamps: true })

module.exports = mongoose.model('transaction', Transaction)
