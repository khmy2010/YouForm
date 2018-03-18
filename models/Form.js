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
    updated: Date,
    online: [Schema.Types.ObjectId]
});

formSchema.statics.requireAuth = async function(fid, user) {
    var form = this;
    let res;

    //check whether the file exists
    try {
        res = await form.findById(fid);
    } catch (e) {
        console.log(e);
    }

    //return immediately if file does not exist.
    if (res === null) {
        return Promise.reject('ERR_02: File does not exist.');
    }

    //return immediately if user does not have permission to access the file.
    if (res.owner.toString() !== user) {
        return Promise.reject(
            'ERR_03: User does not have permission to access this file.'
        );
    }

    //return form if file exist and user has access
    return res;
};

mongoose.model('form', formSchema);
