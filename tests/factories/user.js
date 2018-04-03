const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

const User = mongoose.model('user');

//generate a new user with random googleId and fixed name
module.exports = async () => {
    await User.deleteMany({ googleId: { $in: [/TEST/] } }); //clean up users in test database before proceed
    return new User({
        googleId: 'TEST' + uuidv4(),
        name: 'Mr Jest'
    }).save();
};
