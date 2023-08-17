const router = require('express').Router();
const logic =require('../controllers/Posts.js');
const tokenmiddleware = require('../middleware/tokenmiddleware.js');
const validity = require('../middleware/postValidator.js'); 
//create post
router.post('/post',tokenmiddleware.verifyToken ,validity.validatePosts,logic.createPost);

// //update post
router.put('/:postId',tokenmiddleware.verifyToken ,validity.validatePosts,validity.postIsExiected , logic.updatePost);

// //delete post
router.delete('/:postId',tokenmiddleware.verifyToken,validity.postIsExiected , logic.deletePost);

// //get all posts (timeline)
router.get('/',tokenmiddleware.verifyToken , logic.getAllPosts);

// //get single post   
router.get('/:id',tokenmiddleware.verifyToken , logic.getPost);

// //like post
router.post('/:id/like',tokenmiddleware.verifyToken , logic.likeAndUnlikePost);


module.exports = router
