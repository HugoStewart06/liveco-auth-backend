const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { port } = require('./config');
const authRouter = require('./routes/auth');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(authRouter);

app.get('/', (req, res) => res.send('Express server is up and running!'));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Express server listening on ${port}`);
  }
});
