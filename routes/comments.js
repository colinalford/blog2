var express = require('express');
var router = express.Router();
var Comment = require('../models/comments');

router.get('/user/:user_id', function(req, res){
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
router.post('/', function(req, res) {
    var comment = new Comment();
    comment.blog_id = req.body.blog_id;
    comment.user_id = req.body.user_id;
    comment.body = req.body.body;

    comment.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.json({message: 'Comment Posted'});
        }
    });
});

// Needs authorization
router.put('/:comment_id', function(req, res) {
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
router.delete('/:comment_id', function(req, res) {
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
