const jwt = require('jsonwebtoken');

const verifyjwt = (req, res, next) => {
    if (!req.session || !req.session.jwt) {
        return res.redirect('/unauthorized');
        
    }
    try {
        const token = req.session.jwt;
        const decoded = jwt.verify(token, "sample");
        req.user = {
            mu_id: req.session.user.mu_id,
            mu_email: req.session.user.mu_email,
            mu_fullname: req.session.user.mu_fullname
        };
        next();
    } catch (error) {
        return res.redirect('/login');;
    }
};

module.exports = verifyjwt;
