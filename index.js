const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();
const addRoutes      = require('./routes');
const { db }         = require('./model');
const fillDbDefault  = require('./defaultDb');
const config         = require('./package.json').config;
const moment         = require('moment');
const port = 8000;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res, next) => {
  if (!config.enableAuthorization || req.originalUrl.endsWith('/auth')) {
    next();
    return;
  }

  const token = req.headers['AuthToken'] || req.headers['authtoken'];
  const foundSession = db
    .get('authSessions')
    .find({ token })
    .value();

  const isTokenExpired = foundSession
    && moment(foundSession.expirationDate).unix() > moment().unix()

  if (!token || !foundSession || isTokenExpired) {
    res.status(401).send({
      status: isTokenExpired ? 'Expired token' : 'Unauthorized'
    });
    return;
  }

  next();
});

addRoutes(app);

// Set some defaults (required if your JSON file is empty)
fillDbDefault(db);

app.listen(port, () => {
  console.log('We are live on ' + port);
});
