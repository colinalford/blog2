var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function() {
    passport.serializeUser(function(user, done) {
        var userSessionInfo = {
            _id: user.id,
            username: user.username,
            email: user.email,
            admin: user.isAdmin
        }
        done(null, userSessionInfo);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
        User.findOne({ 'email': email }, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user'}); }
            if (!user.validPassword(password)) { return done(null, false, { message: 'Invalid password'}); }
            return done(null, user);
        });
    }));
}
