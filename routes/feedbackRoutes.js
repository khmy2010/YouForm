const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const validOID = require('../middlewares/valid');

const Feedback = mongoose.model('feedback');

module.exports = app => {
    //post a new thread
    app.post('/api/feedbacks', async (req, res) => {
        const { body } = req;
        const fid = body.fid;
        const qid = body.question;

        if (!ObjectID.isValid(fid) || !ObjectID.isValid(qid)) {
            res.status(400).send('Invalid FID or QID');
            return;
        }
        const feedback = await Feedback.findOne({ fid: body.fid });
        const posts = feedback.posts;

        const post = { ...body };
        delete post.fid;

        posts.push(post);

        const subdoc = posts[posts.length - 1];
        await feedback.save();

        res.send(subdoc);
    });

    //get all at once
    app.get('/api/feedbacks/:fid', validOID, async (req, res) => {
        res.send(
            await Feedback.findOne({ fid: req.params.fid })
                .select('posts')
                .exec()
        );
    });
};
