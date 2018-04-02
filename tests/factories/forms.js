const mongoose = require('mongoose');

const Form = mongoose.model('form');

module.exports = async user => {
    await Form.remove({});
    const form1 = new Form({
        name: 'Testing 1 by ' + user.name,
        owner: user.id,
        updated: Date.now()
    });

    const form2 = new Form({
        name: 'Testing 2 by ' + user.name,
        owner: user.id,
        updated: Date.now()
    });

    await form1.save();
    await form2.save();

    return true;
};
