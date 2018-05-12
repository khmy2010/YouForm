const mongoose = require('mongoose');
const Form = mongoose.model('form');

const excel = require('excel4node');

const generateExcel = async fid => {
    try {
        const workbook = new excel.Workbook({
            defaultFont: {
                size: 12,
                name: 'Arial',
                color: '#000000'
            }
        });

        const sheet = workbook.addWorksheet('Responses');

        const WIDTH = 45;

        const rawResponses = await Form.getResponses(fid);
        const { responses, name, questions } = rawResponses.toObject();

        //title row population
        sheet.row(1).freeze(); //freeze the top row

        const titleRowStyle = workbook.createStyle({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });

        //(row, column)
        sheet.cell(1, 1).string('Timestamp');
        sheet.column(1).setWidth(WIDTH);

        questions.forEach(({ title }, index) => {
            //+1 for zero index, +1 because first column is timestamp
            sheet
                .cell(1, index + 2)
                .string(title)
                .style(titleRowStyle);

            sheet.column(index + 2).setWidth(WIDTH);
        });
        // sheet.column(index + 1).setWidth(45);
        // sheet.cell(1, 1, 1, questions.length + 1).setWidth(40);
        sheet.cell(1, 1).style(titleRowStyle);

        const dataRowStyle = {
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        };

        responses.forEach(({ data, timestamp }, index) => {
            const date = new Date(timestamp);

            //+1: zero index
            //+1: first row is title row
            const currentRow = index + 2;
            sheet
                .cell(currentRow, 1)
                .string(date.toString())
                .style(dataRowStyle);

            //need to map the responses into correct questions
            //because some might not have responses (not required)

            JSON.parse(data).forEach(({ qid, value }) => {
                const question = findByQID(questions, qid);
                if (question) {
                    //first column is for timestamp
                    sheet
                        .cell(currentRow, question.sequence + 1)
                        .string(value)
                        .style(dataRowStyle);
                }
            });
        });

        return { workbook, name };
    } catch (error) {
        throw error;
    }
};

/*
    Need to convert mongo objectID to string before perform comparison
    https://docs.mongodb.com/manual/reference/method/ObjectId/
*/
const findByQID = (questions, qid) =>
    questions.find(({ _id }) => qid === _id.toString());

module.exports.generateExcel = generateExcel;
