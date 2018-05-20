const mongoose = require('mongoose');
const { Schema } = mongoose;

const threadSchema = new Schema({
    question: Schema.Types.ObjectId,
    parent: String,
    timestamp: Number,
    title: String,
    content: String,
    nickName: String,
    isOwner: Boolean
});

module.exports = threadSchema;
