var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var { SELECT } = require('./repository/db_connect');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', function(req, res) {
    res.render('login', { title: 'Login', fullname: 'John Doe', link: 'localhost:3000/', currentRoute: req.originalUrl });
});

router.post('/check-credentials', (req, res) => {
    const { mu_email, mu_password } = req.body;

    if (!mu_email || !mu_password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    let sql = `SELECT * FROM master_admin_user WHERE mu_email = '${mu_email}'`;

    SELECT(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        } 
        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        bcrypt.compare(mu_password, result[0].mu_password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error verifying password' });
            } 
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { userId: result[0].mu_id, email: result[0].mu_email, fullname: result[0].mu_fullname },
                "sample",
                { expiresIn: "1h" }
            );

            req.session.user = {
                mu_id: result[0].mu_id,
                mu_email: result[0].mu_email,
                mu_fullname: result[0].mu_fullname
            };
            req.session.jwt = token;

            console.log("Session after login:", req.session);

            return res.status(200).json({ success: true, message: 'Login successful', token: token });
        });
    });
});


module.exports = router;
/**
 * @swagger
 * /login:
 *   get:
 *     summary: Render the login page
 *     responses:
 *       200:
 *         description: A login page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */

