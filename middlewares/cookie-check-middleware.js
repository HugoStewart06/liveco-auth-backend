const jwt = require('jsonwebtoken');
const { privateKey } = require('../config');

const cookieCheckMiddleware = (req, res, next) => {
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
    // return res.json(payload);
    req.user = payload;
    return next();
  });
};

module.exports = cookieCheckMiddleware;
