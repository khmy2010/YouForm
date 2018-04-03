const { ObjectID } = require('mongodb');

module.exports = (req, res, next) => {
    //if there exists FID inside the request body
    //and the FID wasn't a valid one
    const fid = req.params.fid;
    const qid = req.params.qid;

    if (fid && !ObjectID.isValid(fid)) {
        //then reject the request
        return res.status(400).send({ error: 'Bad FID value passed' });
    }

    //if the FID is valid, then check for QID validity if any
    if (qid && !ObjectID.isValid(qid)) {
        //then reject the request
        return res.status(400).send({ error: 'Bad QID value passed' });
    }

    next();
};
