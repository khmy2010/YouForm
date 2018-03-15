const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Form = mongoose.model('form');

module.exports = app => {
    //user creates a new form
    app.post('/api/forms/new', requireLogin, async (req, res) => {
        const body = req.body;

        const form = new Form({
            name: body.name
        });

        try {
            await form.save();
            res.send(form);
        } catch (err) {
            res.status(400).send(err);
        }
    });
};
