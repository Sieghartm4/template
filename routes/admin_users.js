var express = require('express');
var router = express.Router();
var {SELECT} = require('./repository/db_connect');
var {UPDATE} = require('./repository/db_connect');
var {INSERT} = require('./repository/db_connect');
var {DELETE} = require('./repository/db_connect');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin_users', { title: 'Admin', fullname: 'John Doe', currentRoute: req.originalUrl, email: req.session.user.mu_email });
});

module.exports = router;


router.get('/get-admin-users',(req, res) => {  
  try {
    let sql = "SELECT * FROM master_admin_user";

    SELECT(sql, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: result,
          data: result

        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.put('/put-admin-users/:mu_id', (req, res) => {  
  try {
    const { mu_id } = req.params;
    const { mu_access_id, mu_fullname, mu_email, mu_username } = req.body;
    let sql = `UPDATE master_admin_user SET 
                mu_access_id = ?, 
                mu_fullname = ?, 
                mu_email = ?, 
                mu_username = ?
                WHERE mu_id = ?`;

    let params = [mu_access_id, mu_fullname, mu_email, mu_username, mu_id];
    
    UPDATE(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student info updated successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});


router.post('/post-admin-users', async (req, res) => {  
  try {
    const { mu_access_id, mu_fullname, mu_email, mu_username, mu_password } = req.body;
    const hashedPassword = await bcryptjs.hash(mu_password, saltRounds);
    let sql = `INSERT INTO master_admin_user 
                (mu_access_id, mu_fullname, mu_email, mu_username, mu_password) 
                VALUES (?, ?, ?, ?, ?)`;

    let params = [mu_access_id, mu_fullname, mu_email, mu_username, hashedPassword];
    
    INSERT(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Admin user inserted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.delete('/delete-admin-users/:mu_id', (req, res) => {  
  try {
    const { mu_id } = req.params;

    let sql = `DELETE FROM master_admin_user WHERE mu_id = ?`;

    DELETE(sql, [mu_id], (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Admin info deleted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});