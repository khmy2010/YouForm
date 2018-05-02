const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const excel = require('excel4node');

const login = require('../middlewares/login');
const validOID = require('../middlewares/valid');

const Form = mongoose.model('form');

const DOWNLOAD_LINK = '/api/forms/responses/download/:fid';
module.exports = app => {
    //user attempt to download responses
    app.get('/api/responses/export/:fid', login, validOID, async (req, res) => {
        //create an excel book instance
        const workbook = new excel.Workbook();
        const sheet = workbook.addWorksheet('Responses');

        const rawResponses = await Form.getResponses(req.params.fid);
        const { responses } = rawResponses.toObject();
        workbook.write('Excel.xlsx', res);
    });
};
