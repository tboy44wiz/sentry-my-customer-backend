const mogoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})