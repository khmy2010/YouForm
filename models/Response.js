const mongoose = require('mongoose');
const { Schema } = mongoose;

const responseSchema = new Schema({
    timestamp: Number,
    data: String
});

module.exports = responseSchema;
