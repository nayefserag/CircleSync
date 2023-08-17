const router = require('express').Router();
const logic =require('../controllers/users.js');
const validity = require('../middleware/userValidator.js');

//register user
router.post('/register', validity.validationUser,validity.checkUserExists, logic.registerUser);
//login user
router.post('/login',validity.checkuserLoginRgister, logic.loginUser);


module.exports = router