const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = require('./Question');
const CollabsSchema = require('./Collabs');
const ContextSchema = require('./Context');
const errors = require('../errors');

const formSchema = new Schema({
    name: String,
    startDate: Number,
    endDate: Number,
    status: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: 'user' },
    collabs: [CollabsSchema],
    questions: [QuestionSchema],
    updated: Date,
    online: [Schema.Types.ObjectId],
    context: [ContextSchema]
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
        return Promise.reject(errors.ERR_FILE_NOT_EXIST);
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

formSchema.statics.getPublicForm = async function(fid) {
    var form = this;
    let res;

    res = await form
        .findById(fid)
        .select('startTime endTime status')
        .exec();

    //TODO: check for starting and ending time too
    if (res === null) {
        return Promise.reject(errors.ERR_FILE_NOT_EXIST);
    }

    if (res.status === false) {
        return Promise.reject(errors.ERR_FORM_CLOSED);
    }

    //pass all checks, this form is ready to return
    return await form.findById(fid).select('name questions');
};

mongoose.model('form', formSchema);
