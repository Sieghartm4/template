var express = require('express');
var router = express.Router();
var {SELECT} = require('./repository/db_connect');
var {UPDATE} = require('./repository/db_connect');
var {INSERT} = require('./repository/db_connect');
var {DELETE} = require('./repository/db_connect');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('student_tuition', { title: 'Student Tuition', fullname: 'John Doe', link: 'localhost:3000/', currentRoute: req.originalUrl, email: req.session.user.mu_email });
});

module.exports = router;


router.get('/get-student-tuition',(req, res) => {  
  try {
    let sql = "SELECT * FROM student_tuition_fee";

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

router.put('/put-student-tuition/:stf_id', (req, res) => {  
  try {
    const { stf_id } = req.params;
    const { stf_student_id, stf_school_year, stf_term, stf_total, stf_status } = req.body;

    let sql = `UPDATE student_tuition_fee SET 
                stf_student_id = ?, 
                stf_school_year = ?, 
                stf_term = ?, 
                stf_total = ?, 
                stf_status = ? 
                WHERE stf_id = ?`;

    let params = [stf_student_id, stf_school_year, stf_term, stf_total, stf_status, stf_id];
    
    UPDATE(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student tuition updated successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.post('/post-student-tuition', (req, res) => {  
  try {
    const { stf_student_id, stf_school_year, stf_term, stf_total, stf_status } = req.body;

    let sql = `INSERT INTO student_tuition_fee 
                (stf_student_id, stf_school_year, stf_term, stf_total, stf_status) 
                VALUES (?, ?, ?, ?, ?)`;

    let params = [stf_student_id, stf_school_year, stf_term, stf_total, stf_status];
    
    INSERT(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student tuition inserted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.delete('/delete-student-tuition/:stf_id', (req, res) => {  
  try {
    const { stf_id } = req.params;

    let sql = `DELETE FROM student_tuition_fee WHERE stf_id = ?`;

    DELETE(sql, [stf_id], (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student tuition deleted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});
