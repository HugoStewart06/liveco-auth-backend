require('dotenv').config();

// Feel free to add your own settings,
// e.g. DB connection settings
module.exports = {
  port: process.env.PORT || 5000,
  privateKey: process.env.JWT_SECRET,
};
