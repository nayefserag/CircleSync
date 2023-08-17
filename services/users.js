const asyncMiddleware = require('../middleware/async.js');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const helpers = require('../helpers/helpers.js');
const il8n = require('../Localization/il8n.js');
async function registerUser(req, res, next) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const password = await helpers.hashPassword(req.body.password);
    req.body.password = password;
    await new User(req.body).save();
    const token = helpers.generateToken(User._id, User.isAdmin);
    res.header(process.env.TOKEN_NAME, token).status(201).json({
        message: il8n.__('User-registered-successfully'),
        token
    });
}

async function loginUser(req, res, next) {
    il8n.setLocale(req.headers['accept-language'] || 'en');

    const user = await User.findOne({
        email: req.body.email
    });
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        return res.status(401).json(il8n.__('Invalid-password'));
    }

    const token = helpers.generateToken(user._id, user.isAdmin);
    res.header(process.env.TOKEN_NAME, token).status(200).json({
        message: il8n.__('welcome'),
        token
    });
}

module.exports = {
    registerUser: asyncMiddleware(registerUser),
    loginUser: asyncMiddleware(loginUser)
};