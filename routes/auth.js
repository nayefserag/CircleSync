const router = require('express').Router();
const logic =require('../controllers/users.js');
const validity = require('../middleware/userValidator.js');
const passport = require('passport');

//register user
router.post('/register', validity.validationUser,validity.checkUserExists, logic.registerUser);
//login user
router.post('/login',validity.checkuserLoginRgister, logic.loginUser);

//social login
router.get('/google', passport.authenticate('google' ,{ scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {successRedirect: '/auth/login',failureFlash: true, failureMessage: true}));
module.exports = router