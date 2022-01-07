const express = require('express');
const app = express();
const router = express.Router();
const logger = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const timeout = require('connect-timeout');
const session = require('express-session');

const mongoose = require('./src/scripts/mongoose');
const loggers = require('./src/scripts/logger');
const cronjob = require('./src/scripts/cronjob');
const authMiddleware = require('./src/auth/middlewares/auth.middleware')

/**
 * Every API response will be in this format:
    let responseObj = {
      status: '',
      msg: '',
      body: null
    };
 */

app.use(logger('dev'));

app.use(session({secret: "CDT rocks!"}));

app.use((req, res, next) => {
  loggers.log(
    'info',
    `${req.protocol} ${req.method} ${req.originalUrl} "res":{"statuscode": ${res.statusCode}},"req":{"url":${req.url},"method":${req.method},"httpVersion":${req.httpVersion},"originalUrl":${req.originalUrl},"httpVersion":${req.httpVersion},"query":${JSON.stringify(
      req.query
    )},"protocol":${req.protocol} } `
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  } else {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  next();
});

app.use(cors());
app.use(timeout(30000));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

app.use(haltOnTimedout);
app.use(compression());
app.use(fileUpload({
  createParentPath: true,
  parseNested: true
}));

app.use('/', auth);

// this is to secure all APIs using common the auth middleware
app.use(authMiddleware.auth)

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next()
}

module.exports = app;