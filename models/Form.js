const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = require('./Question');
const CollabsSchema = require('./Collabs');

const formSchema = new Schema({
    name: String,
    startTime: Date,
    endTime: Date,
    status: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: 'user' },
    collabs: [CollabsSchema],
    questions: [QuestionSchema],
    updated: { type: Date, default: Date.now },
    online: [Schema.Types.ObjectId]
});

mongoose.model('form', formSchema);
