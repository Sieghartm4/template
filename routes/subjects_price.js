var express = require('express');
var router = express.Router();
var {SELECT} = require('./repository/db_connect');
var {SELECT2} = require('./repository/db_connect');
var {UPDATE} = require('./repository/db_connect');
var {INSERT} = require('./repository/db_connect');
var {DELETE} = require('./repository/db_connect');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('subjects_price', { title: 'Student Subjects Price', fullname: 'John Doe', link: 'localhost:3000/', currentRoute: req.originalUrl, email: req.session.user.mu_email });
});

module.exports = router;

router.get('/get-subjects-price', (req, res) => {  
    try {
        let sql = "SELECT * FROM master_subject_price";

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

router.get('/get-subjects-description/:ms_id', (req, res) => {  
    try {
        const {ms_id} = req.params;
        let sql = "SELECT ms_description FROM master_subject WHERE ms_id = ?";

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

router.get('/get-subjects', (req, res) => {  
    try {
        let sql = "SELECT * FROM master_subject ";

        SELECT2(sql, (err, result) => {
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

router.put('/put-subjects-price/:msp_id', (req, res) => {  
    try {
        const { msp_id } = req.params;
        const { msp_subject_id, msp_price, msp_no_unit, msp_no_of_hour, msp_status, msp_created_by, } = req.body;

        let sql = `UPDATE master_subject_price SET 
                                msp_subject_id = ?, 
                                msp_price = ?, 
                                msp_no_unit = ?, 
                                msp_no_of_hour = ?, 
                                msp_status = ?, 
                                msp_created_by = ?
                                WHERE msp_id = ?`;

        let params = [msp_subject_id, msp_price, msp_no_unit, msp_no_of_hour, msp_status, msp_created_by, msp_id];
        
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

router.post('/post-subjects-price', (req, res) => {  
    try {
        const { msp_subject_id, msp_price, msp_no_unit, msp_no_of_hour, msp_status, msp_created_by } = req.body;
        const msp_created_date = new Date().toISOString().slice(0, 10);

        let sql = `INSERT INTO master_subject_price 
                                (msp_subject_id, msp_price, msp_no_unit, msp_no_of_hour, msp_status, msp_created_by, msp_created_date) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)`;

        let params = [msp_subject_id, msp_price, msp_no_unit, msp_no_of_hour, msp_status, msp_created_by, msp_created_date];
        
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

router.delete('/delete-subjects-price/:msp_id', (req, res) => {  
    try {
        const { msp_id } = req.params;

        let sql = `DELETE FROM master_subject_price WHERE msp_id = ?`;

        DELETE(sql, [msp_id], (err, result) => {
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
