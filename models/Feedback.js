const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThreadSchema = require('./Response');

const feedbackSchema = new Schema({
    fid: { type: Schema.Types.ObjectId, ref: 'form' },
    posts: [QuestionSchema]
});

module.exports = feedbackSchema;
