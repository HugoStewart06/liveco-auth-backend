const express = require('express');
const cookieCheckMiddleware = require('../middlewares/cookie-check-middleware');
const connection = require('../connection');

const router = express.Router();

router.post('/profile', cookieCheckMiddleware, (req, res) => {
  const { id } = req.user;
  const { email } = req.body;
  if (!email) {
    return res.status(422).json({
      error: 'missing email',
    });
  }
  const sql = 'UPDATE user SET email = ? WHERE id = ?';
  return connection.query(sql, [email, id], (err) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.sendStatus(200);
  });
});

module.exports = router;
