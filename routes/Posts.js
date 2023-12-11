const router = require('express').Router();
const logic =require('../controllers/Posts.js');
const tokenmiddleware = require('../middleware/tokenmiddleware.js');
const validatePost = require('../middleware/postValidator.js'); 
const validateComments = require('../middleware/commentValidator.js');
const TokenOperation = require('../middleware/tokenmiddleware.js');

router.use(TokenOperation.verifyToken);
/**
 * @swagger
 * /search/{hashtag}:
 *   get:
 *     summary: Search posts by hashtag.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: hashtag
 *         required: true
 *         description: The hashtag to search for.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: Search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'  # Reference to your Post schema
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 */
//search Posts by hashtag
router.get('/search/:hashtag',tokenmiddleware.verifyToken,logic.searchPosts);
/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post.
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'  # Reference to your Post schema
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       201:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'  # Reference to your Post schema
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       400:
 *         $ref: '#/components/responses/BadRequest'  # Reference to a 400 Bad Request response definition if needed
 */ 
// //create post
router.post('/post',tokenmiddleware.verifyToken ,validatePost.validatePosts,logic.createPost);
/**
 * @swagger
 * /{postId}:
 *   put:
 *     summary: Update a post by ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'  # Reference to your Post schema
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'  # Reference to your Post schema
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       400:
 *         $ref: '#/components/responses/BadRequest'  # Reference to a 400 Bad Request response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
// //update post
router.put('/:postId',tokenmiddleware.verifyToken ,validatePost.validatePosts,validatePost.postIsExiected , logic.updatePost);
/**
 * @swagger
 * /{postId}:
 *   delete:
 *     summary: Delete a post by ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to delete.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       204:
 *         description: Post deleted successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
// //delete post
router.delete('/:postId',tokenmiddleware.verifyToken,validatePost.postIsExiected , logic.deletePost);
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all posts (timeline).
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: List of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'  # Reference to your Post schema
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 */
// //get all posts (timeline)
router.get('/',tokenmiddleware.verifyToken , logic.getAllPosts);
/**
 * @swagger
 * /{postId}:
 *   get:
 *     summary: Get a single post by ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to retrieve.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: Post details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'  # Reference to your Post schema
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
// //get single post   
router.get('/:postId',tokenmiddleware.verifyToken ,validatePost.postIsExiected ,logic.getPost);
/**
 * @swagger
 * /{postId}/like:
 *   post:
 *     summary: Like or unlike a post by ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to like or unlike.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: Post liked or unliked successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
// //like post
router.post('/:postId/like',tokenmiddleware.verifyToken , logic.likeAndUnlikePost);
/**
 * @swagger
 * /{postId}/comment:
 *   post:
 *     summary: Add a comment to a post by ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to which the comment will be added.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'  # Reference to your Comment schema
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 *       400:
 *         $ref: '#/components/responses/BadRequest'  # Reference to a 400 Bad Request response definition if needed
 */
// //comment post
router.post('/:postId/comment',tokenmiddleware.verifyToken ,validateComments.validateComment,logic.addComment);
/**
 * @swagger
 * /{postId}/comments:
 *   get:
 *     summary: Get all comments for a post by ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to retrieve comments for.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: List of comments for the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'  # Reference to your Comment schema
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
// //get all comments
router.get('/:postId/comments/',tokenmiddleware.verifyToken,validatePost.postIsExiected ,logic.getAllComments);
/**
 * @swagger
 * /{postId}/{commentId}:
 *   delete:
 *     summary: Delete a comment for a post by ID and comment ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post from which to delete the comment.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to delete.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       204:
 *         description: Comment deleted successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
// //delete comment
router.delete('/:postId/:commentId',tokenmiddleware.verifyToken,validatePost.postIsExiected ,logic.removeComment);
/**
 * @swagger
 * /{postId}/{commentId}:
 *   get:
 *     summary: Get a single comment by comment ID for a post by post ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post from which to retrieve the comment.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to retrieve.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: Comment details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'  # Reference to your Comment schema
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 */
// //get comment
router.get('/:postId/:commentId',tokenmiddleware.verifyToken,validatePost.postIsExiected ,logic.getComment);
/**
 * @swagger
 * /{postId}/{commentId}:
 *   put:
 *     summary: Update a comment by comment ID for a post by post ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to which the comment belongs.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'  # Reference to your Comment schema
 *     security:
 *       - BearerAuth: []  # Include this line if you use authentication middleware
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'  # Reference to a 401 Unauthorized response definition if needed
 *       404:
 *         $ref: '#/components/responses/NotFound'  # Reference to a 404 Not Found response definition if needed
 *       400:
 *         $ref: '#/components/responses/BadRequest'  # Reference to a 400 Bad Request response definition if needed
 */
//update comment
router.put('/:postId/:commentId',tokenmiddleware.verifyToken,validatePost.postIsExiected,validateComments.validateComment,logic.updateComment);



module.exports = router
