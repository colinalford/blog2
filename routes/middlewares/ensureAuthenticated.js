module.exports = function(req, res, next) {

    function isAuthenticated() {
        passport.authenticate('local');
    }

    if (req.user.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}
