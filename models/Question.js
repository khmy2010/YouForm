const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    type: String,
    title: String,
    description: String,
    options: [],
    dateType: String,
    validation: String,
    connect: String
});

module.exports = questionSchema;
