const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    googleID: String,
    facebookID: String,
    username: {
        type: String,
        required: String
    },
    email: String,
    password: String,
    created_date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("users", schema)