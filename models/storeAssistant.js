const mongoose = require("mongoose")

//schema for store assistant
const storeAssistantSchema = new mongoose.Schema({
	name: { type: String, required: true},
	phone_number: { type: String, required: true },
	email: { type: String,},
	password: { type: String, default: "password" },
	admin_identity: { type: String, required: true },
	store_id: {type: String, required: true},
	is_active: { type: Boolean, default: 1 },
	user_role: { type: String, default: "store_assistant" },
	api_token: { type: String },
}, { timestamp: true });

module.exports = mongoose.model("storeAssistant", storeAssistantSchema);