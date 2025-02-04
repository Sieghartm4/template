var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require("mysql");
var session = require('express-session');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

const { mongoose, store } = require('./middleware/mongoose');
const {CheckConnection} = require('./routes/repository/db_connect');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/admin_users');
var studentRouter = require('./routes/student_users');
var student_infoRouter = require('./routes/student_info');
var student_gradeRouter = require('./routes/student_grade');
var subjectsRouter = require('./routes/subjects');
var student_tuitionRouter = require('./routes/student_tuition');
var transaction_tuitionRouter = require('./routes/transaction_tuition');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var unauthorizedRouter = require('./routes/unauthorized');


const verifyjwt  = require('./middleware/authentication');
var app = express();
CheckConnection();

app.use(session({
  secret: "sample", 
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { secure: false } 
}));
/*
app.use((req, res, next) => {
  console.log("Session data:", req.session);
  next();
});
*/

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Enrollment System API',
    version: '1.0.0',
    description: 'This is the API documentation',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.set('views', path.join(__dirname, 'views/Layouts'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/unauthorized', unauthorizedRouter);

app.use('/',verifyjwt, indexRouter);
app.use('/admin_users',verifyjwt, usersRouter);
app.use('/student_users',verifyjwt, studentRouter);
app.use('/student_info',verifyjwt, student_infoRouter);
app.use('/student_grade',verifyjwt, student_gradeRouter);
app.use('/subjects',verifyjwt, subjectsRouter);
app.use('/student_tuition',verifyjwt, student_tuitionRouter);
app.use('/transaction_tuition',verifyjwt, transaction_tuitionRouter);




app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
app.listen(5000,() =>
  console.log('Server is running on port 5000;')
);