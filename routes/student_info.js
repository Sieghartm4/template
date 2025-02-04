var express = require('express');
var router = express.Router();
var {SELECT} = require('./repository/db_connect');
var {SELECT2} = require('./repository/db_connect');
var {UPDATE} = require('./repository/db_connect');
var {INSERT} = require('./repository/db_connect');
var {DELETE} = require('./repository/db_connect');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('student_info', { title: 'Student Info', fullname: 'John Doe', link: 'localhost:3000/', currentRoute: req.originalUrl, email: req.session.user.mu_email });
});

module.exports = router;


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

router.get('/get-student-grade/:ms_id', (req, res) => {  
  try {
    const { ms_id } = req.params;
    console.log(ms_id);
    let sql = `SELECT * FROM student_grade WHERE sg_student_id = ?`;

    SELECT2(sql, [ms_id], (err, result) => {
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

router.put('/update-student-info/:ms_id', (req, res) => {  
  try {
    const { ms_id } = req.params;
    const { ms_student_id, ms_first_name, ms_middle_name, ms_last_name, ms_date_of_birth, ms_contact_no, ms_email, ms_address, ms_image, ms_status, ms_created_by, ms_created_date } = req.body;

    let sql = `UPDATE master_student SET 
                ms_student_id = ?, 
                ms_first_name = ?, 
                ms_middle_name = ?, 
                ms_last_name = ?, 
                ms_date_of_birth = ?, 
                ms_contact_no = ?, 
                ms_email = ?, 
                ms_address = ?, `;
    
    let params = [ms_student_id, ms_first_name, ms_middle_name, ms_last_name, ms_date_of_birth, ms_contact_no, ms_email, ms_address];

    if (ms_image) {
      sql += `ms_image = ?, `;
      params.push(ms_image);
    }

    sql += `ms_status = ?, 
            ms_created_by = ?, 
            ms_created_date = ? 
            WHERE ms_id = ?`;

    params.push(ms_status, ms_created_by, ms_created_date, ms_id);
    
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

router.post('/post-student-info', (req, res) => {  
  try {
    const { ms_student_id, ms_first_name, ms_middle_name, ms_last_name, ms_date_of_birth, ms_contact_no, ms_email, ms_address, ms_image, ms_status, ms_created_by, ms_created_date } = req.body;

    let sql = `INSERT INTO master_student 
                (ms_student_id, ms_first_name, ms_middle_name, ms_last_name, ms_date_of_birth, ms_contact_no, ms_email, ms_address, ms_image, ms_status, ms_created_by, ms_created_date) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    let params = [ms_student_id, ms_first_name, ms_middle_name, ms_last_name, ms_date_of_birth, ms_contact_no, ms_email, ms_address, ms_image, ms_status, ms_created_by, ms_created_date];
    
    INSERT(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student info inserted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});


router.delete('/delete-student-info/:ms_id', (req, res) => {  
  try {
    const { ms_id } = req.params;

    let sql = `DELETE FROM master_student WHERE ms_id = ?`;

    DELETE(sql, [ms_id], (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student info deleted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});