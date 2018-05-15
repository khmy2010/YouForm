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

    app.get('/api/discover', async (req, res) => {
        const forms = await Form.find({ status: true })
            .populate('owner')
            .select(
                'name owner updated questions startingDate endingDate context _id'
            );
        // console.log(forms);

        const filtered = forms.reduce((acc, form) => {
            const {
                name,
                owner,
                updated,
                questions,
                startingDate,
                endingDate,
                context,
                _id
            } = form;

            //check form starting date
            if (startingDate) {
                //haven't start yet, don't need to include in discovery.
                if (Date.now() - startingDate < 0) return acc;
            }

            if (endingDate) {
                if (Date.now() - endingDate > 0) return acc;
            }

            const obj = {
                name,
                updated,
                context,
                owner: owner.name,
                length: questions.length,
                fid: _id
            };

            acc.push(obj);

            return acc;
        }, []);

        res.send(filtered);
    });

    //data obj: {type: [desktop, mobile]}
    app.post('/api/forms/:fid/track', validOID, async (req, res) => {
        const { fid } = req.params;
        const { type } = req.body;

        console.log(type);

        await Form.findByIdAndUpdate(req.params.fid, { $inc: { [type]: 1 } });
        res.send();
    });
};
