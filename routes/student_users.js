var express = require('express');
var router = express.Router();
var {SELECT} = require('./repository/db_connect');
var {SELECT2} = require('./repository/db_connect');
var {UPDATE} = require('./repository/db_connect');
var {INSERT} = require('./repository/db_connect');
var {DELETE} = require('./repository/db_connect');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('student_users', { title: 'Student Users', fullname: 'John Doe', link: 'localhost:3000/', currentRoute: req.originalUrl, email: req.session.user.mu_email });
});

module.exports = router;

/**
 * @swagger
 * /student_users/get-student-users:
 *  get:
 *    summary: Get a list of student users
 *    responses:
 *      200:
 *        description: A list of student users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/student_user'
 * 
 * components:
 *   schemas:
 *     student_user:
 *       type: object
 *       properties:
 *         su_id:
 *           type: integer
 *         su_student_id:
 *           type: integer
 *         su_username:
 *           type: string
 *         su_password:
 *           type: string
 *         su_status:
 *           type: string 
 */

router.get('/get-student-users',(req, res) => {  
  try {
    let sql = "SELECT * FROM student_user";

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

/**
 * @swagger
 * /student_users/get-student-grade/{sg_id}:
 *   get:
 *     summary: Get a student grade by ID
 */
router.get('/get-student-grade/:sg_id', (req, res) => {  
  try {
    const { sg_id } = req.params;
    let sql = `SELECT * FROM student_grade WHERE sg_student_id = ?`;

    SELECT2(sql, [sg_id], (err, result) => {
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

router.get('/get-student-subject/:ms_id', (req, res) => {  
  try {
    const { ms_id } = req.params;
    let sql = `SELECT ms_description FROM master_subject WHERE ms_id = ?`;

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

router.put('/put-student-users/:su_id', (req, res) => {  
  try {
    const { su_id } = req.params;
    const { su_student_id, su_username, su_password, su_status } = req.body;

    let sql = `UPDATE student_user SET 
                su_student_id = ?, 
                su_username = ?, 
                su_password = ?, 
                su_status = ? 
                WHERE su_id = ?`;

    let params = [su_student_id, su_username, su_password, su_status, su_id];
    
    UPDATE(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student users updated successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.post('/post-student-users', (req, res) => {  
  try {
    const { su_student_id, su_username, su_password, su_status } = req.body;

    let sql = `INSERT INTO student_user 
                (su_student_id, su_username, su_password, su_status) 
                VALUES (?, ?, ?, ?)`;

    let params = [su_student_id, su_username, su_password, su_status];
    
    INSERT(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student users inserted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.delete('/delete-student-users/:su_id', (req, res) => {  
  try {
    const { su_id } = req.params;

    let sql = `DELETE FROM student_user WHERE su_id = ?`;

    DELETE(sql, [su_id], (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Student users deleted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});