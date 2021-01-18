const mysql = require('mysql2');

const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
});

module.exports = connection;
