module.exports = function(req, res, next) {
    if (req.isAuthenticated() && req.user.id === req.params.user_id) { return next(); }
    res.redirect('../api/users/login');
}
