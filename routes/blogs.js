var express = require('express');
var router = express.Router();
var Blog = require('../models/blog');
var ensureAuthenticated = require('./middlewares/ensureAuthenticated');
var isAdmin = require('./middlewares/isAdmin');

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

router.get('/new', isAdmin, function(req, res) {
    res.render('new_blog', {title: "Colin's Blog | New Blog"});
});

// Needs authorization
router.post('/new', isAdmin, function(req, res) {

    var blog = new Blog();
    blog.title = req.body.title;
    blog.body = req.body.body;

    blog.save(function(err) {
        if (err){
            res.send(err);
        } else {
            res.redirect('/api/blog/'+blog.id);
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

// Needs authorization
router.put('/:blog_id', isAdmin, function(req, res) {
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

// Needs authorization
router.delete('/:blog_id', isAdmin, function(req, res) {
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
