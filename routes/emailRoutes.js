const nodemailer = require('nodemailer');
const login = require('../middlewares/login');
const keys = require('../config/keys');

const hbs = require('nodemailer-express-handlebars');

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
        defaultLayout: 'fill'
    },
    viewPath: 'email',
    extName: '.hbs'
};

transporter.use('compile', hbs(options));

//email function should focus on sending email, regardless of content.
module.exports = app => {
    app.post('/api/email', login, (req, res) => {
        /*
            Required data for posting:
            to, subject, mode
        */
        const { to, subject } = req.body;

        if (to === undefined || subject === undefined) {
            res.status(400).send('Insufficient parameter(s)');
            return;
        }

        const mailOptions = {
            from: '"YouForm Mailer" <mailservice.youform@gmail.com>', // sender address
            to: 'kehan.see@gmail.com', // list of receivers
            subject: subject, // Subject line
            template: 'fill',
            context: {
                name: req.user.name
            }
        };

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
