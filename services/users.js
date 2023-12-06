const asyncMiddleware = require('../middleware/async.js');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const helpers = require('../helpers/helpers.js');
const il8n = require('../Localization/il8n.js');

async function registerUser(req, res, next) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const password = await helpers.hashPassword(req.body.password);
    req.body.password = password;
    const user = new User(req.body)
    const token = helpers.generateToken(User._id, User.isAdmin);
    const refreshToken = helpers.refreshToken(User._id, User.isAdmin);
    user.refreshToken = refreshToken;
    await user.save();
    res.header(process.env.TOKEN_NAME, token).status(201).json({
        message: il8n.__('User-registered-successfully'),
        token,
        refreshToken
    });
}

async function loginUser(req, res, next) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const newFcmToken = req.body.fcmToken
    const user = await User.findOne({
        email: req.body.email
    });
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        return res.status(401).json(il8n.__('Invalid-password'));
    }
    if (newFcmToken && newFcmToken !== user.fcmToken) {
        user.fcmToken = newFcmToken;
        await user.save();
      }
    const token = helpers.generateToken(user._id, user.isAdmin);
    const refreshToken = helpers.refreshToken(user._id, user.isAdmin);
    user.refreshToken = refreshToken;
    await user.save();
    res.header(process.env.TOKEN_NAME, token).status(200).json({
        message: il8n.__('welcome'),
        token,
        refreshToken
    });
}

//logout 
async function logoutUser(req, res, next) {
    // Clear the user's session data
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
        // Redirect to the home page or any other appropriate page after logging out
        res.redirect('login');
      }
    });
  }


//refresh token 


module.exports = {
    registerUser: asyncMiddleware(registerUser),
    loginUser: asyncMiddleware(loginUser),
    logoutUser: asyncMiddleware(logoutUser)

};





