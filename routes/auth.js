const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../connection');
const { privateKey } = require('../config');

const router = express.Router();

const checkRequiredAuthFields = (req, res, next) => {
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
  return next();
};

router.post('/api/auth/register', checkRequiredAuthFields, (req, res) => {
  // 1a. récupérer les infos du body
  const { email, password } = req.body;

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

router.post('/api/auth/login', checkRequiredAuthFields, (req, res) => {
  // récupérer des infos depuis req.body
  const { email, password } = req.body;

  // éventuellement (très conseillé) vérifier infos
  // voir middleware

  // vérifier que l'email et le password matchent
  //   1. vérifier qu'un user avec l'email fourni existe
  const sql =
    'SELECT id, password AS hash FROM user WHERE BINARY email = BINARY ?';
  // éventuellement ajouter BINARY après WHERE
  connection.query(sql, [email], (err, users) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    // Pas d'utilisateur trouvé => user inconnu => 401
    if (users.length === 0) {
      // Statut 401 = Unauthorized
      return res.status(401).json({
        error: 'wrong email or password',
      });
    }

    // Arrivé ici, on sait qu'on a un utilisateur avec l'email
    const user = users[0];

    //   2. comparer le mdp en clair avec le mdp chiffré venant de la BDD
    // Ajout d'un return pour être cohérent avec celui de la L.78
    return bcrypt.compare(password, user.hash, (errBcrypt, passwordsMatch) => {
      if (errBcrypt) {
        return res.status(500).json({ error: 'could not check password' });
      }
      // passwordsMatch indique si les passwords correspondent (true) ou non
      if (!passwordsMatch) {
        // Statut 401 = Unauthorized
        return res.status(401).json({
          error: 'wrong email or password',
        });
      }

      // Arrivé ici, on sait que l'email et le password sont corrects

      // générer un JWT propre à cet utilisateur (contenant l'id)
      // NOTE : ajout d'un return pour être cohérents avec L.90 et L.95
      const options = {
        expiresIn: '1h',
      };
      return jwt.sign(
        { id: user.id },
        privateKey,
        options,
        (errToken, token) => {
          if (errToken) {
            return res.status(500).json({ error: 'could not generate token' });
          }

          // Arrivé ici (pas d'erreur), on a bien le JWT dans token
          // envoyer le JWT dans un cookie
          res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000,
          });
          // Return la réponse (cohérence avec L.106)
          return res.json({ id: user.id });
        },
      );
    });
  });
});

router.get('/api/auth/check', (req, res) => {
  // On récupère le token (JWT) depuis les cookies
  const { token } = req.cookies;
  // Si le token n'est pas présent => erreur 401
  if (!token) {
    return res.sendStatus(401);
  }
  // Vérifie la validité du JWT : il ne doit pas avoir expiré,
  // et doit avoir été généré avec notre clé secrète privateKey
  return jwt.verify(token, privateKey, (err, payload) => {
    // Si erreur (JWT expiré, signature invalide) => 401
    if (err) {
      console.error(err);
      return res.sendStatus(401);
    }
    // Pas d'erreur : le JWT est valide. On renvoie son contenu
    // (sa payload ou charge utile, contenant ici l'id de l'utilisateur)
    return res.json(payload);
  });
});

module.exports = router;
