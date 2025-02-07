var express = require('express');
var router = express.Router();
var {SELECT} = require('./repository/db_connect');
var {SELECT2} = require('./repository/db_connect');
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

router.get('/get-student-transaction/:ttf_id',(req, res) => {  
  try {
    const { ttf_id } = req.params;
    let sql = "SELECT * FROM transaction_tuition_fee WHERE ttf_tuition_fee_id = ?";

    SELECT2(sql, [ttf_id],  (err, result) => {
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

router.get('/get-student-firstname/:ms_student_id',(req, res) => {  
  try {
    const { ms_student_id } = req.params;
    let sql = "SELECT ms_first_name FROM master_student WHERE ms_student_id = ?";

    SELECT2(sql, [ms_student_id],  (err, result) => {
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

router.get('/get-student-info',(req, res) => {  
  try {
    let sql = "SELECT * FROM master_student";

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
    const { stf_student_id, stf_school_year, stf_term, stf_status } = req.body;

    let sql = `SELECT SUM(msp.msp_price) AS total
               FROM master_subject_price msp
               JOIN student_grade sg ON msp.msp_subject_id = sg.sg_subject_id
               WHERE sg.sg_student_id = ? AND sg.sg_term = ? AND sg.sg_school_year = ?`;

    SELECT2(sql, [stf_student_id, stf_term, stf_school_year], (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        const stf_total = result[0].total;

        let insertSql = `INSERT INTO student_tuition_fee 
                         (stf_student_id, stf_school_year, stf_term, stf_total, stf_status) 
                         VALUES (?, ?, ?, ?, ?)`;

        let params = [stf_student_id, stf_school_year, stf_term, stf_total, stf_status];
        
        INSERT(insertSql, params, (err, insertResult) => {
          if (err) {
            res.status(500).json({message: err});
          } else {
            res.status(200).json({
              message: 'Student tuition inserted successfully',
              data: insertResult
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.post('/check-student-tuition', (req, res) => {  
  try {
    const { stf_student_id, stf_school_year, stf_term } = req.body;

    let sql = `SELECT * FROM student_tuition_fee 
               WHERE stf_student_id = ? AND stf_school_year = ? AND stf_term = ?`;

    SELECT2(sql, [stf_student_id, stf_school_year, stf_term], (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else if (result.length > 0) {
        res.status(200).json({
          message: 'Record already exists',
          data: result,
          duplicate: true
        });
      } else {
        res.status(200).json({
          message: 'No matching record found',
          duplicate: false
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});
router.post('/check-tuition-total', (req, res) => {  
  try {
    const { stf_student_id, stf_school_year, stf_term } = req.body;

    let sql = `SELECT SUM(msp.msp_price) AS total
               FROM master_subject_price msp
               JOIN student_grade sg ON msp.msp_subject_id = sg.sg_subject_id
               WHERE sg.sg_student_id = ? AND sg.sg_term = ? AND sg.sg_school_year = ?`;

    SELECT2(sql, [stf_student_id, stf_term, stf_school_year], (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        if (result.length > 0) {
          const stf_total = result[0].total;
          if (stf_total === 0) {
            res.status(200).json({
              message: 'Total is zero, show modal',
              showModal: true
            });
          } else {
            res.status(200).json({
              message: 'Total is not zero',
              showModal: false
            });
          }
        } else {
          res.status(200).json({
            message: 'No data found',
            showModal: false
          });
        }
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
