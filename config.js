const path = require('path');

const isTest = process.env.NODE_ENV === 'test';
const envFile = isTest ? '.env.test' : '.env';

require('dotenv').config({
  path: path.join(__dirname, envFile),
});

// Feel free to add your own settings,
// e.g. DB connection settings
module.exports = {
  port: process.env.PORT || 5000,
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
  },
};
