const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const requireLogin = require('../middlewares/requireLogin');
const validOID = require('../middlewares/valid');

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

    //fetch form admin interface
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

    //fetch list of forms own by user
    app.get('/api/forms', requireLogin, async (req, res) => {
        try {
            const forms = await Form.find({ owner: req.user._id })
                .limit(10)
                .sort('name')
                .select('name _id')
                .exec();

            res.send(forms);
        } catch (err) {
            res.status(400).send(err);
        }
    });

    //add a new question to the form
    app.post('/api/forms/:fid/questions', requireLogin, async (req, res) => {
        const body = req.body;
        const fid = req.params.fid;

        if (ObjectID.isValid(fid)) {
            const form = await Form.findById(fid);
            const questions = form.questions;

            const question = {
                sequence: 1,
                ...body
            };

            questions.push(question);
            const subdoc = questions[questions.length - 1];
            await form.save();
            res.send(subdoc);
        }
    });

    //delete question from the form
    app.delete(
        '/api/forms/:fid/questions/:qid',
        requireLogin,
        validOID,
        async (req, res) => {
            const fid = req.params.fid;
            const qid = req.params.qid;

            /* 
                Documentations:
                http://mongoosejs.com/docs/subdocs.html
                under "Removing subdocs" section
            */

            const form = await Form.findById(fid);
            const questions = form.questions;
            questions.id(qid).remove();
            await form.save();
            res.send();
        }
    );

    //modify question from the form
    app.put(
        '/api/forms/:fid/questions/:qid',
        requireLogin,
        validOID,
        async (req, res) => {
            const fid = req.params.fid;
            const qid = req.params.qid;
            const body = req.body;

            // const form = await Form.findById(fid);
            // console.log(form);
            await Form.findOneAndUpdate(
                { _id: fid, 'questions._id': qid },
                {
                    $set: {
                        'questions.$': body
                    }
                }
            );
            res.send();
        }
    );

    //changing form properties
    app.patch('/api/forms/:fid', requireLogin, async (req, res) => {
        const body = req.body;
        const fid = req.params.fid;

        if (ObjectID.isValid(fid)) {
            await Form.update({ _id: fid }, { $set: body });
            res.send();
        } else {
            res.status(400).send();
        }
    });
};
