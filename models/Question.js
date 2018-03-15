const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    question: Number,
    type: String,
    description: String,
    isRequired: {
        type: Boolean,
        default: false
    }
});

module.exports = questionSchema;
