const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { port } = require('./config');
const authRouter = require('./routes/auth');

const app = express();
app.use(morgan('dev'));
// Middleware permettant de "parser" (analyser) les cookies
// reçus dans les headers de requête. Va renseigner res.cookies,
// objet contenant les cookies sous forme de paires clé-valeur
app.use(cookieParser());
app.use(express.json());
// CORS = Cross Origin Request Sharing
// https://developer.mozilla.org/fr/docs/Web/HTTP/CORS
// Permet d'accepter des requêtes provenant d'une origine
// (ici http://localhost:3000) différente de celle du backend
// (ici http://localhost:5000).
// Ici on configure les CORS pour n'autoriser que les requêtes
// provenant du front, et pour autoriser les credentials (identifiants,
// en l'occurence ici le token transmis via un cookie)
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(authRouter);

app.get('/', (req, res) => res.send('Express server is up and running!'));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Express server listening on ${port}`);
  }
});
