var express = require('express');
var router = express.Router();
var {INSERT} = require('./repository/db_connect');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register', fullname: 'John Doe', link: 'localhost:3000/', currentRoute: req.originalUrl });
});

module.exports = router;


router.post('/post-register', async (req, res) => {  
  try {
    const { mu_fullname, mu_email, mu_username, mu_password } = req.body;

    const hashedPassword = await bcryptjs.hash(mu_password, saltRounds);

    let sql = `INSERT INTO master_admin_user 
                (mu_access_id, mu_fullname, mu_email, mu_username, mu_password) 
                VALUES (?, ?, ?, ?, ?)`;

    let params = ["1", mu_fullname, mu_email, mu_username, hashedPassword];
    
    INSERT(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.redirect('/login');
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});
