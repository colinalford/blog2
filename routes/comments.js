var express = require('express');
var router = express.Router();
var Comment = require('../models/comments');
var isUser = require('./middlewares/isUser');
var ensureAuthenticated = require('./middlewares/ensureAuthenticated');

// Requires authorization
router.get('/user/:user_id', isUser, function(req, res){
    Comment.find({user_id: req.params.user_id})
        .sort({date: -1})
        .exec(function(err, comments) {
            if (err) {
                res.send(err);
            } else {
                res.json(comments);
            }
        });
});

router.get('/blog/:blog_id', function(req, res) {
    Comment.find({blog_id: req.params.blog_id})
        .sort({date: -1})
        .exec(function(err, comments) {
            if (err) {
                res.send(err);
            } else {
                res.json(comments);
            }
        });
});

// Needs authorization
router.post('/', ensureAuthenticated, function(req, res) {
    var comment = new Comment();
    comment.blog_id = req.body.blog_id;
    comment.user.user_id = req.user.id;
    comment.user.username = req.user.username;
    comment.body = req.body.body;

    console.log(req.body.blog_id);

    comment.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/api/blog/'+comment.blog_id);
        }
    });
});

// Needs authorization
router.put('/:comment_id', isUser, function(req, res) {
    Comment.findById(req.params.comment_id, function(req, res) {
        if (err) {
            res.send(err);
        } else {
            comment.body = req.body.body;

            comment.save(function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({message: 'Comment updated'});
                }
            });
        }
    });
});

// Needs authorization
router.delete('/:comment_id', isUser, function(req, res) {
    Comment.remove({
        _id: req.params.comment_id
    }, function(err, comment) {
        if (err) {
            res.send(errr);
        } else {
            res.json({ message: 'Comment deleted' });
        }
    });
});

module.exports = router;
