const nodemailer = require('nodemailer');
const login = require('../middlewares/login');
const validOID = require('../middlewares/valid');
const keys = require('../config/keys');

const hbs = require('nodemailer-express-handlebars');
const Handlebars = require('handlebars');
const excel = require('../services/excel');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: keys.mailingAccount,
        pass: keys.mailingPassword
    }
});

const options = {
    viewEngine: {
        extname: '.hbs',
        layoutsDir: 'email/',
        defaultLayout: 'promo'
    },
    viewPath: 'email',
    extName: '.hbs'
};

const getBase = () => {
    const local = 'http://localhost:3000';
    const prod = 'https://youform.herokuapp.com';
    return process.env.NODE_ENV === 'production' ? prod : local;
};

//given a link, this function will concat it with base link
//base link: http://localhost:3000 OR https://youform.herokuapp.com
const generateHandlebarsLink = link => {
    const url = getBase() + link;

    return new Handlebars.SafeString(Handlebars.Utils.escapeExpression(url));
};

transporter.use('compile', hbs(options));

//email function should focus on sending email, regardless of content.
module.exports = app => {
    app.post('/api/email/promo', login, (req, res) => {
        const { to, subject, fid } = req.body;

        if (
            to === undefined ||
            to.length === 0 ||
            subject === undefined ||
            fid === undefined
        ) {
            res.status(400).send('Insufficient parameter(s)');
            return;
        }

        const mailOptions = {
            from: `"YouForm Mailer" <${keys.mailingAccount}>`, // sender address
            subject: subject, // Subject line
            template: 'promo',
            context: {
                name: req.user.name,
                link: generateHandlebarsLink(`/forms/${fid}`)
            }
        };

        if (to.length === 1) mailOptions.to = to[0];
        else mailOptions.bcc = to;

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) res.status(500).send(error);

            res.send(info);
        });
    });

    app.post('/api/email/results', login, validOID, async (req, res) => {
        const { to, fid } = req.body;

        if (to === undefined || to.length === 0 || fid === undefined) {
            res.status(400).send();
            return;
        }

        const ret = await excel.generateExcel(fid);
        const mailOptions = {
            from: '"YouForm Mailer" <mailservice.youform@gmail.com>', // sender address
            subject: `${req.user.name} has shared responses to you`, // Subject line
            template: 'promo',
            context: {
                name: req.user.name,
                link: generateHandlebarsLink(`/forms/${fid}`)
            },
            attachments: [
                {
                    filename: `${ret.name}.xlsx`,
                    content: await ret.workbook.writeToBuffer(),
                    contentType:
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            ]
        };

        if (to.length === 1) mailOptions.to = to[0];
        else mailOptions.bcc = to;

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) res.status(500).send(error);

            res.send(info);
        });
    });
};

/*
    Resources:
    1. Responsive Email CSS Inliner
    https://htmlemail.io/inline/


*/
