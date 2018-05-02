const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const validOID = require('../middlewares/valid');

const Form = mongoose.model('form');

module.exports = app => {
    //get form
    app.get('/api/forms/:fid', validOID, async (req, res) => {
        try {
            res.send(await Form.getPublicForm(req.params.fid));
        } catch ({ code, msg }) {
            res.status(code).send(msg);
        }
    });

    //submit responses
    app.post('/api/forms/:fid/responses', validOID, async (req, res) => {
        const body = req.body;
        const form = await Form.findById(req.params.fid);
        const responses = form.responses;

        const response = {
            ...body
        };

        responses.push(response);
        const subdoc = responses[responses.length - 1];
        await form.save();
        res.send(subdoc);
    });
};
