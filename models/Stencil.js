const mongoose = require('mongoose');
const { Schema } = mongoose;

const stencilSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'user' },
    type: String,
    title: String,
    description: String,
    options: String,
    dateType: String,
    validation: String,
    connect: String
});

mongoose.model('stencil', stencilSchema);

module.exports = stencilSchema;
