const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = require('./Question');
const CollabsSchema = require('./Collabs');
const ContextSchema = require('./Context');
const errors = require('../errors');

const formSchema = new Schema({
    name: String,
    startingDate: Number,
    endingDate: Number,
    status: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: 'user' },
    collabs: [CollabsSchema],
    questions: [QuestionSchema],
    tests: [QuestionSchema],
    updated: Number,
    online: [Schema.Types.ObjectId],
    context: [ContextSchema]
});

//update timestamp prior save
formSchema.pre('save', function(next) {
    var form = this;
    form.updated = Date.now();
    next();
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
        .select('startingDate endingDate status')
        .exec();

    if (res === null) {
        return Promise.reject(errors.ERR_FILE_NOT_EXIST);
    }

    if (res.status === false) {
        return Promise.reject(errors.ERR_FORM_CLOSED);
    }

    if (res.startingDate) {
        const now = Date.now();
        if (now - res.startingDate < 0) {
            return Promise.reject(errors.ERR_FORM_NOTSTART);
        }
    }

    if (res.endingDate) {
        const now = Date.now();
        if (now - res.endingDate > 0) {
            return Promise.reject(errors.ERR_FORM_CLOSED);
        }
    }

    //pass all checks, this form is ready to return
    return await form.findById(fid).select('name questions context');
};

mongoose.model('form', formSchema);
