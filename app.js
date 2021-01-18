const express = require('express');
const authRouter = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(authRouter);

app.get('/', (req, res) => res.send('Express server is up and running!'));

module.exports = app;
