const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const login = require('../middlewares/login');
const validOID = require('../middlewares/valid');

const Form = mongoose.model('form');

module.exports = app => {
    //user creates a new form
    app.post('/api/forms/new', login, async (req, res) => {
        const body = req.body;

        const welcomeContext = { type: 'Welcome' };
        const thanksContext = { type: 'Thanks' };

        const form = new Form({
            name: body.name,
            owner: req.user.id,
            updated: body.updated
        });

        form.context.push(welcomeContext);
        form.context.push(thanksContext);

        try {
            await form.save();
            res.send(form);
        } catch (err) {
            res.status(400).send(err);
        }
    });

    //fetch form admin interface
    app.get('/api/forms/admin/:fid', login, validOID, async (req, res) => {
        const fid = req.params.fid;

        //find form by id
        try {
            const form = await Form.requireAuth(fid, req.user.id);
            // const form = await Form.findById(fid);
            res.send(form);
        } catch (err) {
            res.status(403).send(err);
        }
    });

    //fetch list of forms own by user
    app.get('/api/forms', login, async (req, res) => {
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
    app.post('/api/forms/:fid/questions', login, async (req, res) => {
        const body = req.body;
        const fid = req.params.fid;

        if (ObjectID.isValid(fid)) {
            const form = await Form.findById(fid);
            const questions = form.questions;

            const question = {
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
        login,
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
        login,
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
    app.patch('/api/forms/:fid', login, async (req, res) => {
        const body = req.body;
        const fid = req.params.fid;

        if (ObjectID.isValid(fid)) {
            await Form.update({ _id: fid }, { $set: body });
            res.send();
        } else {
            res.status(400).send();
        }
    });

    //update form context
    app.post('/api/forms/:fid/context', login, validOID, async (req, res) => {
        const body = req.body;
        const type = body.type;
        const fid = req.params.fid;

        await Form.findOneAndUpdate(
            { _id: fid, 'context.type': type },
            {
                $set: {
                    'context.$.title': body.title,
                    'context.$.description': body.description,
                    'context.$.promoteSharing': body.promoteSharing,
                    'context.$.buttonText': body.buttonText
                }
            }
        );

        res.send();
    });

    app.get('/api/forms/:fid/questions', login, validOID, async (req, res) => {
        const form = await Form.findById(req.params.fid);
        res.send(form.questions);
    });

    //modify array of questions
    app.put('/api/forms/:fid/questions', login, validOID, async (req, res) => {
        //to avoid it wipe entire questions array and causes content to be corrupted.
        if (req.body.length > 0) {
            await Form.findOneAndUpdate(
                { _id: req.params.fid },
                { $set: { questions: req.body } }
            );
            res.send();
        } else res.status(400).send();
    });
};
