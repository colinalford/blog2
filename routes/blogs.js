var express = require('express');
var router = express.Router();
var Blog = require('../models/blog');
var Comment = require('../models/comments');

router.get('/', function (req, res) {
    var last_displayed_date = req.query.lastDate ? req.query.lastDate : Date.now();

    Blog.find({created_at: {$lt: last_displayed_date}}).
        sort({created_at: -1}).limit(10).exec(function(err, blogs){
            if(err){
                res.send(err);
            } else {
                res.json(blogs);
            }
        });
});

router.post('/', function(req, res) {
    var blog = new Blog();
    blog.title = req.body.title;
    blog.body = req.body.body;

    blog.save(function(err) {
        if (err){
            res.send(err);
        } else {
            res.json({ message: 'Blog Created' });
        }
    });
});

router.get('/:blog_id', function(req, res) {
    Blog.findById(req.params.blog_id, function(err, blog) {
        if(err){
            res.send(err);
        } else {
            res.render('blog_view', {
                title: "Colin's Blog | " + blog.title,
                blog: blog,
            });
        }
    });
});

router.put('/:blog_id', function(req, res) {
    Blog.findById(req.params.blog_id, function(err, blog) {
        if(err){
            res.send(err);
        } else {
            blog.title = req.body.title;
            blog.body = req.body.body;
            blog.isHidden = req.body.isHidden;

            blog.save(function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({ message: 'Blog updated' });
                }
            });
        }
    });
});

router.delete('/:blog_id', function(req, res) {
    Blog.remove({
        _id: req.params.blog_id
    }, function(err, blog) {
        if (err) {
            res.send(errr);
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
})

module.exports = router;
