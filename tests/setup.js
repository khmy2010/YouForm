jest.setTimeout(1000000); //fuck my laptop :)

require('../models/User');
require('../models/Form');
require('../models/Question');
require('../models/Collabs');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose
    .connect(keys.mongoURI)
    .then(() => {})
    .catch(e => console.log('Error while connecting to Mongo: ', e));
