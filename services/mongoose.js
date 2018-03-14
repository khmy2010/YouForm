const mongoose = require('mongoose');

const keys = require('../config/keys');

mongoose
    .connect(keys.mongoURI)
    .then(() => {
        console.log('Connected to mongo instance');
    })
    .catch(e => console.log('Error while connecting to Mongo: ', e));
