var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Template', fullname: 'John Doe', currentRoute: req.originalUrl, userID: req.session.user.mu_id, email: req.session.user.mu_email });
});

module.exports = router;

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ message: "Error logging out" });
      }
      res.redirect('/login');
  });
});
