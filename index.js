const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const keys = require('./config/keys');

//load database model before anything else
require('./models/User');
require('./models/Form');
require('./models/Feedback');

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
require('./routes/authRoutes')(app);
require('./routes/formRoutes')(app);
require('./routes/responseRoutes')(app);
require('./routes/publicRoutes')(app);
require('./routes/feedbackRoutes')(app);

//email handler
require('./routes/emailRoutes')(app);

//load testing API only in development environment
if (process.env.NODE_ENV === undefined) {
    require('./routes/testRoutes')(app);
}

//only in production
if (['production', 'ci'].includes(process.env.NODE_ENV)) {
    //order of operation is important here.

    //express will serve up production asset (main.js / main.css)
    app.use(express.static('client/build'));

    //express will serve up the index.html if it doesn't recognise the route.
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
