const mongoose = require('mongoose');
const { Schema } = mongoose;

const collabsSchema = new Schema({
    user: Schema.Types.ObjectId,
    accessRight: Number
});

module.exports = collabsSchema;
