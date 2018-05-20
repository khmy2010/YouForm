const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThreadSchema = require('./Thread');

const feedbackSchema = new Schema({
    fid: { type: Schema.Types.ObjectId, ref: 'form' },
    posts: [ThreadSchema]
});

mongoose.model('feedback', feedbackSchema);

module.exports = feedbackSchema;
