var express = require('express');
var router = express.Router();
var {SELECT} = require('./repository/db_connect');
var {SELECT2} = require('./repository/db_connect');
var {UPDATE} = require('./repository/db_connect');
var {INSERT} = require('./repository/db_connect');
var {DELETE} = require('./repository/db_connect');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('transaction_tuition', { title: 'Transaction Tuition', fullname: 'John Doe', link: 'localhost:3000/', currentRoute: req.originalUrl, email: req.session.user.mu_email, fullname: req.session.user.mu_fullname });
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

router.get('/get-student-tuition', (req, res) => {  
  try {
    let sql = "SELECT * FROM student_tuition_fee WHERE stf_status != 'PAID'";

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

router.get('/get-student-info/:ms_id', (req, res) => {  
  try {
    const { ms_id } = req.params;
    let sql = "SELECT * FROM master_student WHERE ms_student_id = ?";

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

router.put('/put-transaction-tuition/:ttf_id', (req, res) => {  
  try {
    const { ttf_id } = req.params;
    const { ttf_tuition_fee_id, ttf_mode_of_payment, ttf_amount, ttf_previous_balance, ttf_current_balance, ttf_paid_by } = req.body;

    let sql = `UPDATE transaction_tuition_fee SET 
                ttf_tuition_fee_id = ?, 
                ttf_mode_of_payment = ?, 
                ttf_amount = ?, 
                ttf_previous_balance = ?, 
                ttf_current_balance = ?, 
                ttf_received_by = ?, 
                ttf_paid_by = ? 
                WHERE ttf_id = ?`;

    let params = [ttf_tuition_fee_id, ttf_mode_of_payment, ttf_amount, ttf_previous_balance, ttf_current_balance, fullname, ttf_paid_by, ttf_id];
    
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


router.post('/post-transaction-tuition', async (req, res) => {  
  try {
    const { ttf_tuition_fee_id, ttf_mode_of_payment, ttf_amount,  ttf_paid_by } = req.body;
    const fullname = req.session.user.mu_fullname;

    let sql = "SELECT stf_total FROM student_tuition_fee WHERE stf_id = ?";
    let previousBalanceResult = await new Promise((resolve, reject) => {
      SELECT2(sql, [ttf_tuition_fee_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (previousBalanceResult.length === 0) {
      return res.status(404).json({ message: 'Tuition fee ID not found' });
    }

    let ttf_previous_balance = previousBalanceResult[0].stf_total;

    sql = "SELECT SUM(ttf_amount) as total_amount FROM transaction_tuition_fee WHERE ttf_tuition_fee_id = ?";
    let transactionResult = await new Promise((resolve, reject) => {
      SELECT2(sql, [ttf_tuition_fee_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    let totalAmount = transactionResult[0].total_amount || 0;
    let ttf_current_balance = ttf_previous_balance - totalAmount - ttf_amount;

    if (ttf_current_balance < 0) {
      if (totalAmount < ttf_previous_balance) {
        let remainingAmount = ttf_previous_balance - totalAmount;
        ttf_current_balance = 0;
        sql = `INSERT INTO transaction_tuition_fee 
                (ttf_tuition_fee_id, ttf_mode_of_payment, ttf_amount, ttf_previous_balance, ttf_current_balance, ttf_received_by, ttf_paid_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

        let params = [ttf_tuition_fee_id, ttf_mode_of_payment, remainingAmount, ttf_previous_balance, ttf_current_balance, fullname, ttf_paid_by];
        
        INSERT(sql, params, async (err, result) => {
          if (err) {
            res.status(500).json({ message: err });
          } else {
              let updateSql = "UPDATE student_tuition_fee SET stf_status = 'PAID' WHERE stf_id = ?";
              await new Promise((resolve, reject) => {
                UPDATE(updateSql, [ttf_tuition_fee_id], (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
                });
              });
            res.status(200).json({
              message: 'Transaction tuition inserted successfully',
              data: result,
              showModal: false
            });
          }
        });
      } else {
        return res.status(200).json({
          message: 'Current balance is zero, transaction not inserted',
          showModal: true
        });
      }
    } else {
      sql = `INSERT INTO transaction_tuition_fee 
              (ttf_tuition_fee_id, ttf_mode_of_payment, ttf_amount, ttf_previous_balance, ttf_current_balance, ttf_received_by, ttf_paid_by) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`;

      let params = [ttf_tuition_fee_id, ttf_mode_of_payment, ttf_amount, ttf_previous_balance, ttf_current_balance, fullname, ttf_paid_by];
      
      INSERT(sql, params, async (err, result) => {
        if (err) {
          res.status(500).json({ message: err });
        } else {
          if (Number(totalAmount) + Number(ttf_amount) === ttf_previous_balance) {
            let updateSql = "UPDATE student_tuition_fee SET stf_status = 'PAID' WHERE stf_id = ?";
            await new Promise((resolve, reject) => {
              UPDATE(updateSql, [ttf_tuition_fee_id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
              });
            });
          } else {
            let updateSql = "UPDATE student_tuition_fee SET stf_status = 'PARTIALLY PAID' WHERE stf_id = ?";
            await new Promise((resolve, reject) => {
              UPDATE(updateSql, [ttf_tuition_fee_id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
              });
            });
          }
          res.status(200).json({
            message: 'Transaction tuition inserted successfully',
            data: result,
            showModal: false
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
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
