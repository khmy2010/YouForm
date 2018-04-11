const mongoose = require('mongoose');
const { Schema } = mongoose;

const contextSchema = new Schema({
    type: String,
    title: String, //for thanks only
    description: String,
    buttonText: String,
    promoteSharing: Boolean
});

module.exports = contextSchema;
