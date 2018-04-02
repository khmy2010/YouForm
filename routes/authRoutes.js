const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = app => {
    app.get(
        '/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    app.get(
        '/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/app/dashboard');
        }
    );

    app.get('/api/logout', (req, res) => {
        req.logout(); //attached by passport automatically
        res.redirect('/');
    });

    app.get('/api/current_user', (req, res) => {
        console.log(req.user);
        res.send(req.user);
    });
};
