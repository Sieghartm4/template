var express = require('express');
var router = express.Router();
var {SELECT} = require('./repository/db_connect');
var {SELECT2} = require('./repository/db_connect');
var {UPDATE} = require('./repository/db_connect');
var {INSERT} = require('./repository/db_connect');
var {DELETE} = require('./repository/db_connect');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('subjects', { title: 'Student Subjects', fullname: 'John Doe', link: 'localhost:3000/', currentRoute: req.originalUrl, email: req.session.user.mu_email });
});

module.exports = router;


router.get('/get-master-subjects', (req, res) => {  
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

router.get('/get-subjects-price/:msp_id', (req, res) => {  
  try {
    const {msp_id} = req.params;
    let sql = "SELECT * FROM master_subject_price WHERE msp_subject_id = ?";

    SELECT2(sql,[msp_id], (err, result) => {
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

router.get('/get-subjects-price/:msp_id', (req, res) => {  
  try {
    const {msp_id} = req.params;
    let sql = "SELECT * FROM master_subject_price WHERE msp_subject_id = ?";

    SELECT2(sql,[msp_id], (err, result) => {
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

router.get('/get-subjects-data/:ms_id', (req, res) => {  
  try {
    const {ms_id} = req.params;
    let sql = "SELECT ms_description FROM master_subject WHERE ms_id = ?";

    SELECT2(sql,[ms_id], (err, result) => {
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

router.put('/put-master-subjects/:ms_id', (req, res) => {  
  try {
    const { ms_id } = req.params;
    const { ms_code, ms_description, ms_status, ms_created_by, ms_created_date } = req.body;

    let sql = `UPDATE master_subject SET 
                ms_code = ?, 
                ms_description = ?, 
                ms_status = ?, 
                ms_created_by = ?, 
                ms_created_date = ? 
                WHERE ms_id = ?`;

    let params = [ms_code, ms_description, ms_status, ms_created_by, ms_created_date, ms_id];
    
    UPDATE(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Master subject updated successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.post('/post-master-subjects', (req, res) => {  
  try {
    const { ms_code, ms_description, ms_status, ms_created_by } = req.body;
    const ms_created_date = new Date().toISOString().slice(0, 10);

    let sql = `INSERT INTO master_subject 
                (ms_code, ms_description, ms_status, ms_created_by, ms_created_date) 
                VALUES (?, ?, ?, ?, ?)`;

    let params = [ms_code, ms_description, ms_status, ms_created_by, ms_created_date];
    
    INSERT(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Master subject inserted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.delete('/delete-master-subjects/:ms_id', (req, res) => {  
  try {
    const { ms_id } = req.params;

    let sql = `DELETE FROM master_subject WHERE ms_id = ?`;

    DELETE(sql, [ms_id], (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Master subject deleted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});