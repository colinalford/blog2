var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var isUser = require('./middlewares/isUser');


/* GET users listing. */

router.get('/signup', function(req, res) {
    res.render('signup', {title: "Colin's Blog"});
});

router.post('/signup', function(req, res) {
    var user = new User();
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = user.generateHash(req.body.password);

    user.save(function(err) {
        if (err) {res.send(err);}
        res.redirect('/');
    })
});

router.get('/login', function(req, res) {
    res.render('login', {title: "Colin's Blog"});
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('./login');
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    })
});

// Needs authorization
router.get('/:user_id', isUser, function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    })
});

// Needs authorization
router.post('/:user_id', function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        } else {
            user.password = user.generateHash(req.body.password);
        }
    });
});

// Needs authorization
router.delete('/:user_id', function(req, res) {
    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err) {
            res.send(err);
        } else {
            res.send({ message: 'User removed' });
        }
    });
});

module.exports = router;
