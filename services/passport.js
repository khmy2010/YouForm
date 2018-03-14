const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(e => console.log(e));
});

//google oauth
passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            const existedUser = await User.findOne({ googleId: profile.id });
            console.log(profile);
            if (existedUser) {
                done(null, existedUser);
            } else {
                const user = await new User({
                    googleId: profile.id,
                    name: profile.displayName
                }).save();
                done(null, user);
            }
        }
    )
);
