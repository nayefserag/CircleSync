const session = require('express-session');
const config = require('../config');
module.exports = session({
  secret: config.session.secret,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3600000,
  },
});
