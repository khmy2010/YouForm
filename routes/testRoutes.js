//this route is only for development purpose
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const login = require('../middlewares/login');
const validOID = require('../middlewares/valid');

const { populateQuestions } = require('../tests/seeds/questions');

const Form = mongoose.model('form');

module.exports = app => {
    app.get('/test', (req, res) => {
        res.send('If you are seeing this, then this works!');
    });

    app.post('/test', (req, res) => {
        res.send('If you are seeing this, then this works!');
    });

    app.post('/test/:fid/questions', login, validOID, async (req, res) => {
        const form = await Form.findOneAndUpdate(
            { _id: req.params.fid },
            { $set: { questions: populateQuestions() } },
            { new: true }
        );

        res.send(form);
    });

    app.delete('/test/:fid/questions', login, validOID, async (req, res) => {
        const form = await Form.findOneAndUpdate(
            { _id: req.params.fid },
            { $set: { questions: [] } },
            { new: true }
        );

        res.send(form);
    });

    app.get('/test/:fid/questions', login, validOID, async (req, res) => {
        const form = await Form.findById(req.params.fid);
        res.send(form.questions);
    });

    app.delete(
        '/test/:fid/questions/:qid',
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
            const updatedForm = await Form.findById(fid);
            res.send(updatedForm);
        }
    );
};
