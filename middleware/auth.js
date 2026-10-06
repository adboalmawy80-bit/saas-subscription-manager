module.exports = {
    isAuth: (req, res, next) => {
        if (req.session && req.session.userId) {
            return next();
        }
        return res.redirect('/login');
    },
    isGuest: (req, res, next) => {
        if (req.session && req.session.userId) {
            return res.redirect('/dashboard');
        }
        return next();
    }
};