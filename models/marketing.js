const mogoose = require("mongoose");

const marketingSchema = new mongoose.Schema({
    store_ref_code: {
            type: String,
            required: true
        },
        message: String,
        status: String,
        user_ref_id: {
            type: String,
            required: true
        },
        publish_date: {
            type: Date,
            default: Date.now()
        }
})
module.exports = mongoose.model("marketing", marketingSchema);