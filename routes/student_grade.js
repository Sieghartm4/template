var express = require('express');
var router = express.Router();
var {SELECT} = require('./repository/db_connect');
var {UPDATE} = require('./repository/db_connect');
var {INSERT} = require('./repository/db_connect');
var {DELETE} = require('./repository/db_connect');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('student_grade', { title: 'Student Grade', fullname: 'John Doe', link: 'localhost:3000/', currentRoute: req.originalUrl, email: req.session.user.mu_email });
});

module.exports = router;


router.get('/get-student-grade',(req, res) => {  
  try {
    let sql = "SELECT * FROM student_grade";

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

router.get('/get-student-subject',(req, res) => {  
  try {
    let sql = "SELECT * FROM master_subject";

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


router.put('/put-student-grade/:sg_id', (req, res) => {  
  try {
    const { sg_id } = req.params;
    const { sg_student_id, sg_subject_id, sg_school_year, sg_term, sg_grades, sg_final_grade, sg_status } = req.body;

    let sql = `UPDATE student_grade SET 
                sg_student_id = ?, 
                sg_subject_id = ?, 
                sg_school_year = ?, 
                sg_term = ?, 
                sg_grades = ?, 
                sg_final_grade = ?, 
                sg_status = ? 
                WHERE sg_id = ?`;

    let params = [sg_student_id, sg_subject_id, sg_school_year, sg_term, sg_grades, sg_final_grade, sg_status, sg_id];
    
    UPDATE(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student grade updated successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.post('/post-student-grade', (req, res) => {  
  try {
    const { sg_student_id, sg_subject_id, sg_school_year, sg_term, sg_grades, sg_final_grade, sg_status } = req.body;

    let sql = `INSERT INTO student_grade 
                (sg_student_id, sg_subject_id, sg_school_year, sg_term, sg_grades, sg_final_grade, sg_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

    let params = [sg_student_id, sg_subject_id, sg_school_year, sg_term, sg_grades, sg_final_grade, sg_status];
    
    INSERT(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student grade inserted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.delete('/delete-student-grade/:sg_id', (req, res) => {  
  try {
    const { sg_id } = req.params;

    let sql = `DELETE FROM student_grade WHERE sg_id = ?`;

    DELETE(sql, [sg_id], (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student grade deleted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});