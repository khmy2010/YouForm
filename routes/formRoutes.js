const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const requireLogin = require('../middlewares/requireLogin');

const Form = mongoose.model('form');

module.exports = app => {
    //user creates a new form
    app.post('/api/forms/new', requireLogin, async (req, res) => {
        const body = req.body;

        const form = new Form({
            name: body.name,
            owner: req.user.id,
            updated: body.updated
        });

        try {
            await form.save();
            res.send(form);
        } catch (err) {
            res.status(400).send(err);
        }
    });

    app.get('/api/forms/admin/:fid', requireLogin, async (req, res) => {
        const body = req.body;
        const fid = req.params.fid;

        //check validity of ObjectID before proceed to avoid error in mongo side.
        if (ObjectID.isValid(fid)) {
            //find form by id
            try {
                const form = await Form.requireAuth(fid, req.user.id);
                // const form = await Form.findById(fid);
                res.send(form);
            } catch (err) {
                res.status(403).send(err);
            }
        } else {
            res.status(400).send('ERR_01: Invalid ObjectID.');
        }
    });

    app.get('/api/forms', requireLogin, async (req, res) => {
        try {
            const forms = await Form.find({ owner: req.user._id })
                .skip(parseInt(req.query.skipCount))
                .limit(10)
                .sort('name')
                .exec();

            res.send(forms);
        } catch (err) {
            res.status(400).send(err);
        }
    });
};
