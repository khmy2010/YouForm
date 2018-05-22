const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const login = require('../middlewares/login');

const Stencil = mongoose.model('stencil');

module.exports = app => {
    app.post('/api/stencils', login, async (req, res) => {
        const { body } = req;

        const stencil = new Stencil({
            owner: req.user._id,
            ...body
        });

        try {
            await stencil.save();
            res.send(stencil);
        } catch (error) {
            res.status(400).send(error);
        }
    });

    app.delete('/api/stencils', login, async (req, res) => {
        const sid = req.body.sid;

        if (!sid) {
            res.status(400).send('SID is missing');
            return;
        }

        try {
            const stencil = await Stencil.deleteOne({ _id: sid });
            res.send(stencil);
        } catch (error) {
            res.status(400).send('error when deleting stencil');
        }
    });

    app.get('/api/stencils', login, async (req, res) => {
        res.send(await Stencil.find({ owner: req.user._id }));
    });

    app.delete('/api/stencils/all', login, async (req, res) => {
        await Stencil.deleteMany({ owner: req.user._id });
        res.send();
    });
};
