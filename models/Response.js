const mongoose = require('mongoose');
const { Schema } = mongoose;

const responseSchema = new Schema({
    timestamp: Number,
    data: String,
    duration: Number
});

module.exports = responseSchema;
