const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    sequence: Number,
    type: String,
    title: String,
    description: String,
    options: [],
    dateType: String,
    validation: String
});

module.exports = questionSchema;
