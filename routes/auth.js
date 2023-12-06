const router = require('express').Router();
const logic =require('../controllers/users.js');
const validity = require('../middleware/userValidator.js');
const TokenOperation = require('../middleware/tokenmiddleware.js');
const passport = require('passport');
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for user authentication.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully.
 */
//register user
router.post('/register', validity.validationUser,validity.checkUserExists, logic.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with a registered user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User logged in successfully.
 */
//login user
router.post('/login',validity.checkuserLoginRgister, logic.loginUser);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth2.0 login.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth2.0 login page.
 */
//social login
router.get('/google', passport.authenticate('google' ,{ scope: ['profile', 'email'] }));


/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback URL for Google OAuth2.0 login.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to the appropriate URL based on login success or failure.
 */

router.get('/google/callback', passport.authenticate('google', {successRedirect: '/auth/login',failureFlash: true, failureMessage: true}));


router.get('/logout', logic.logoutUser);

//Refresh Token
router.post('/refresh-token',TokenOperation.refreshedToken);


//Protected Route
router.get('/protected', TokenOperation.verifyToken);
module.exports = router