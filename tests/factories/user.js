const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

const User = mongoose.model('user');

//generate a new user with random googleId and fixed name
module.exports = async () => {
    await User.remove({}); //clean up users in test database before proceed
    return new User({
        googleId: uuidv4(),
        name: 'Mr Test'
    }).save();
};