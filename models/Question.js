const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    sequence: Number,
    type: String,
    title: String,
    description: String,
    options: String,
    dateType: String,
    validation: String,
    connect: String
});

module.exports = questionSchema;
