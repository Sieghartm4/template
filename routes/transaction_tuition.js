var express = require('express');
var router = express.Router();
var {SELECT} = require('./repository/db_connect');
var {UPDATE} = require('./repository/db_connect');
var {INSERT} = require('./repository/db_connect');
var {DELETE} = require('./repository/db_connect');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('transaction_tuition', { title: 'Transaction Tuition', fullname: 'John Doe', link: 'localhost:3000/', currentRoute: req.originalUrl, email: req.session.user.mu_email });
});

module.exports = router;


router.get('/get-transaction-tuition', (req, res) => {  
  try {
    let sql = "SELECT * FROM transaction_tuition_fee";

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

router.put('/put-transaction-tuition/:ttf_id', (req, res) => {  
  try {
    const { ttf_id } = req.params;
    const { ttf_tuition_fee_id, ttf_mode_of_payment, ttf_amount, ttf_previous_balance, ttf_current_balance, ttf_received_by, ttf_paid_by } = req.body;

    let sql = `UPDATE transaction_tuition_fee SET 
                ttf_tuition_fee_id = ?, 
                ttf_mode_of_payment = ?, 
                ttf_amount = ?, 
                ttf_previous_balance = ?, 
                ttf_current_balance = ?, 
                ttf_received_by = ?, 
                ttf_paid_by = ? 
                WHERE ttf_id = ?`;

    let params = [ttf_tuition_fee_id, ttf_mode_of_payment, ttf_amount, ttf_previous_balance, ttf_current_balance, ttf_received_by, ttf_paid_by, ttf_id];
    
    UPDATE(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Transaction tuition updated successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.post('/post-transaction-tuition', (req, res) => {  
  try {
    const { ttf_tuition_fee_id, ttf_mode_of_payment, ttf_amount, ttf_previous_balance, ttf_current_balance, ttf_received_by, ttf_paid_by } = req.body;

    let sql = `INSERT INTO transaction_tuition_fee 
                (ttf_tuition_fee_id, ttf_mode_of_payment, ttf_amount, ttf_previous_balance, ttf_current_balance, ttf_received_by, ttf_paid_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

    let params = [ttf_tuition_fee_id, ttf_mode_of_payment, ttf_amount, ttf_previous_balance, ttf_current_balance, ttf_received_by, ttf_paid_by];
    
    INSERT(sql, params, (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Transaction tuition inserted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});

router.delete('/delete-transaction-tuition/:ttf_id', (req, res) => {  
  try {
    const { ttf_id } = req.params;

    let sql = `DELETE FROM transaction_tuition_fee WHERE ttf_id = ?`;

    DELETE(sql, [ttf_id], (err, result) => {
      if (err) {
        res.status(500).json({message: err});
      } else {
        res.status(200).json({
          message: 'Transaction tuition deleted successfully',
          data: result
        });
      }
    });
  } catch (error) {
    res.status(500).json({message: error});
  }
});
