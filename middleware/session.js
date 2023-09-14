const session = require('express-session');

module.exports = session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3600000,
  },
});
