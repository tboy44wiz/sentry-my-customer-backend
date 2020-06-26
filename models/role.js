const mogoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    id: {
        type: String,
        default: "store_admin"
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("role", roleSchema);