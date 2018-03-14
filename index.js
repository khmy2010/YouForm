const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const keys = require('./config/keys');

//load database model before anything else
require('./models/User');

//load services after database model
require('./services/mongoose');
require('./services/passport');

const app = express();

//middlewares
app.use(bodyParser.json());

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey, keys.cookieBackupKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

//routes handler
require('./routes/auth')(app);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
