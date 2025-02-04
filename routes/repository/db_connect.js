const mysql = require("mysql");

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
require("dotenv").config();

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  exports.CheckConnection = () => {
    connection.connect((err) => {
      if (err) {
        console.log("Error connecting to database ...", err);
        return;
      }
      console.log("Connection established ...");
    });
  };

exports.SELECT = (sql, callback) => {
    try {
      connection.query(sql, function (error, results) {
        if (error) throw error;
       return callback(null,results);
       
      });
    } catch (error) {
      console.log(error);
      return callback(error,null);
    }
    
}   
exports.SELECT2 = (sql, param, callback) => {
  try {
    connection.query(sql, param, function (error, results) {
      if (error) throw error;
     return callback(null,results);
     
    });
  } catch (error) {
    console.log(error);
    return callback(error,null);
  }
  
}   


exports.UPDATE = (sql, param, callback) => {
  try {
    connection.query(sql, param, function (error, results) {
      if (error) throw error;
     return callback(null,results);
     
    });
  } catch (error) {
    console.log(error);
    return callback(error,null);
  }
  
}   

exports.INSERT = (sql, param, callback) => {
  try {
    connection.query(sql, param, function (error, results) {
      if (error) throw error;
     return callback(null,results);
     
    });
  } catch (error) {
    console.log(error);
    return callback(error,null);
  }
  
}   

exports.DELETE = (sql, param, callback) => {
  try {
    connection.query(sql, param, function (error, results) {
      if (error) throw error;
     return callback(null,results);
     
    });
  } catch (error) {
    console.log(error);
    return callback(error,null);
  }
  
}   