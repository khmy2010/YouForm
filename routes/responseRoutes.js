const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const login = require('../middlewares/login');
const validOID = require('../middlewares/valid');

const excel = require('../services/excel');

const Form = mongoose.model('form');

module.exports = app => {
    //user attempt to download responses
    app.get('/api/responses/export/:fid', login, validOID, async (req, res) => {
        try {
            const ret = await excel.generateExcel(req.params.fid);
            ret.workbook.write(`${ret.name}.xlsx`, res);
        } catch (error) {
            console.error(error);
            res.status(500).send('Unable to generate Spreadsheet.');
        }
    });

    app.get('/api/responses/:fid', login, validOID, async (req, res) => {
        try {
            res.send(await Form.findById(req.params.fid).select('responses'));
        } catch (error) {
            res.status(400).send('Unable to get responses');
        }
    });

    app.get('/api/responses/:fid/track', login, validOID, async (req, res) => {
        try {
            res.send(
                await Form.findById(req.params.fid).select('desktop mobile')
            );
        } catch (error) {
            res.status(400).send('Unable to get stat');
        }
    });

    app.post('/api/responses/poll', login, validOID, async (req, res) => {
        const { fid, before, after } = req.body;
        try {
            // const data = await Form.find({
            //     responses: { $elemMatch: { timestamp: { $gte: after } } }
            // });
            // const data = await Form.find({ _id: fid, 'responses' });
            const data = await Form.findById(fid).select(
                'responses desktop mobile'
            );
            const { responses, desktop, mobile } = data.toObject();

            const filtered = responses.filter(({ timestamp }, index) => {
                return timestamp >= before && timestamp <= after;
            });

            res.send({ responses: filtered, desktop, mobile });
        } catch (error) {
            res.status(500).send(`Unable to get responses: ${error}`);
        }
    });
};
