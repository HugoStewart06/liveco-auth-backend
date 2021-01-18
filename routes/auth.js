const express = require('express');
const bcrypt = require('bcryptjs');
const isEmail = require('is-email');
const connection = require('../connection');

const router = express.Router();

router.post('/api/auth/register', (req, res) => {
  // 1a. récupérer les infos du body
  const { email, password } = req.body;

  // 1b. valider les infos du body = vérifier qu'on a bien reçu
  //     un email et un mot de passe (éventuellement vérif longueur mdp)
  // Minimum vital = vérifier la présence des champs
  if (!email || !password) {
    return res.status(422).json({
      error: 'email and/or password missing',
    });
  }

  if (!isEmail(email)) {
    return res.status(422).json({
      error: 'wrong email format',
    });
  }

  // 2. hacher/chiffrer le mot de passe
  // const hash = bcrypt.hashSync(password, 15);
  return bcrypt.hash(password, 14, (errHash, hash) => {
    if (errHash) {
      return res.status(500).json({
        error: 'could not hash password',
      });
    }
    // pas d'erreur : je peux faire qqchose avec le hash
    // 3. insérer le nouvel utilisateur dans la table user
    return connection.query(
      'INSERT INTO user (email, password) VALUES(?, ?)',
      [email, hash],
      (errInsert, status) => {
        // Erreur au niveau de MySQL
        if (errInsert) {
          // Tentative d'insérer 2x le meme email => code ER_DUP_ENTRY
          if (errInsert.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
              error: 'an account already exists with this email',
            });
          }
          // Gestion des autres erreurs MySQL
          return res.status(500).json({
            error: 'could not insert user',
          });
        }
        return res.status(201).json({
          id: status.insertId,
        });
      },
    );
  });
});

router.post('/api/auth/login', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
