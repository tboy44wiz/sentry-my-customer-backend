const mongoose = require("mongoose"),
	Transaction = require("./transaction")


const customerSchema = new mongoose.Schema({
	name: { type: String, required: true },
	phone_number: { type: String, default: "Not set" },
	email: { type: String, default: "Not set" },
	store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store'
	}
}, { timestamps: true });

module.exports = mongoose.model("customer", customerSchema);