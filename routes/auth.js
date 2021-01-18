const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/register', (req, res) => {
  // 1a. récupérer les infos du body
  console.log(req.body);
  const { email, password } = req.body;

  // 1b. valider les infos du body = vérifier qu'on a bien reçu
  //     un email et un mot de passe (éventuellement vérif longueur mdp)
  // Minimum vital = vérifier la présence des champs
  if (!email || !password) {
    res.status(422).json({
      error: 'email and/or password missing',
    });
  }

  // 2. hacher/chiffrer le mot de passe
  const hash = bcrypt.hashSync(password, 15);
  console.log(hash);

  // 3. insérer le nouvel utilisateur dans la table user
  res.sendStatus(200);
});

router.post('/login', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
