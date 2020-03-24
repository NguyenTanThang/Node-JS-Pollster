const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionSchema = new Schema({
    opinion: {
        type: String,
        required: [true, "An option must have a corresponding opinion"]
    },
    voters: {
        type: [{
            voter_id: String
        }],
        default: []
    },
    votersCount: {
        type: Number,
        default: 0
    }
})

const schema = new Schema({
    question: {
        type: String,
        required: [true, "A poll must contain a question"]
    },
    options: {
        type: [optionSchema],
        required: true
    },
    user_id: {
        type: String,
        required: [true, "A poll must have an author"]
    },
    totalVoters: {
        type: Number,
        default: 0
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("polls", schema)