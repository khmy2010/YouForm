jest.setTimeout(30000);

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose
    .connect(keys.mongoURI)
    .then(() => {
        console.log('Jest x Mongo');
    })
    .catch(e => console.log('Error while connecting to Mongo: ', e));
