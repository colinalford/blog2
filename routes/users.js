var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

/* GET users listing. */

router.get('/signup', function(req, res) {
    res.render('partials/signup_form');
});

router.post('/signup', function(req, res) {
    var user = new User();
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = user.generateHash(req.body.password);
    user.isAdmin = req.body.isAdmin ? true : false;

    user.save(function(err) {
        if (err) {res.send(err);}
        res.json({ message: 'User created' });
    })
});

router.get('/login', function(req, res) {
    res.render('partials/login_form');
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/failed');
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/:user_id', function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    })
});

router.post('/:user_id', function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        } else {
            user.password = user.generateHash(req.body.password);
        }
    });
});

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
