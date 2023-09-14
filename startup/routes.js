const userRoutes = require("../routes/users.js");
const authRoutes = require("../routes/auth.js");
const postRoutes = require("../routes/Posts.js");
const error = require("../middleware/error.js");
const bodyParser = require('body-parser');
const express = require('express');
const il8n = require('../Localization/il8n.js');
const passport = require('../middleware/passport');
const sessionConfig  = require('../middleware/session');
//


module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(sessionConfig);
    app.use(express.json());
    app.use('/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/posts', postRoutes);
    app.use(error);
    app.use(il8n.init);
    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(passportfunction);

}