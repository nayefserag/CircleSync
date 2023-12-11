const router = require('express').Router();
const logic = require('../controllers/useroperations.js');
const tokenmiddleware = require('../middleware/tokenmiddleware.js');
const TokenOperation = require('../middleware/tokenmiddleware.js');
router.use(TokenOperation.verifyToken);
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get a list of all users.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: List of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'  # Reference to your User schema
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 */
// Get All Users
router.get('/', tokenmiddleware.verifyToken, logic.getAllUsers);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update user information by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'  # Reference to your User schema
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: User information updated successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 *       400:
 *         $ref: '#/components/responses/BadRequest'  # Reference to a 400 Bad Request response definition if needed
 */
//Update Profile 
router.put('/:id', tokenmiddleware.verifyToken, logic.updateuser);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a user by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
// Delete Profile
router.delete('/:id', tokenmiddleware.verifyToken, logic.deleteuser);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get user information by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: User details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'  # Reference to your User schema
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
// Get Profile
router.get('/:id', tokenmiddleware.verifyToken ,logic.getUser);

/**
 * @swagger
 * /{id}/follow:
 *   post:
 *     summary: Follow a user by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to follow.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: User followed successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
//follow another user
router.post('/:id/follow', tokenmiddleware.verifyToken,logic.followuser)

/**
 * @swagger
 * /{id}/unfollow:
 *   post:
 *     summary: Unfollow a user by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to unfollow.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: User unfollowed successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
//unfollow another user
router.post('/:id/unfollow', tokenmiddleware.verifyToken, logic.unfollowuser)

/**
 * @swagger
 * /{id}/followers:
 *   get:
 *     summary: Get followers of a user by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve followers for.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: List of user followers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'  # Reference to your User schema
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
//get My followers list
router.get('/:id/followers', tokenmiddleware.verifyToken, logic.getfollowers)

/**
 * @swagger
 * /{id}/following:
 *   get:
 *     summary: Get users followed by a user by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve followed users for.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: List of users followed by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'  # Reference to your User schema
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
//get My Following list
router.get('/:id/following', tokenmiddleware.verifyToken, logic.getfollowing)

// get report
// router.get('/reports', services.getReports)
module.exports = router