const router = require('express').Router();
const logic =require('../controllers/Posts.js');
const tokenmiddleware = require('../middleware/tokenmiddleware.js');
const validatePost = require('../middleware/postValidator.js'); 
const validateComments = require('../middleware/commentValidator.js');

//search Posts by hashtag
router.get('/search/:hashtag',tokenmiddleware.verifyToken,logic.searchPosts);


// //create post
router.post('/post',tokenmiddleware.verifyToken ,validatePost.validatePosts,logic.createPost);

// //update post
router.put('/:postId',tokenmiddleware.verifyToken ,validatePost.validatePosts,validatePost.postIsExiected , logic.updatePost);

// //delete post
router.delete('/:postId',tokenmiddleware.verifyToken,validatePost.postIsExiected , logic.deletePost);

// //get all posts (timeline)
router.get('/',tokenmiddleware.verifyToken , logic.getAllPosts);

// //get single post   
router.get('/:postId',tokenmiddleware.verifyToken ,validatePost.postIsExiected ,logic.getPost);

// //like post
router.post('/:postId/like',tokenmiddleware.verifyToken , logic.likeAndUnlikePost);

// //comment post
router.post('/:postId/comment',tokenmiddleware.verifyToken ,validateComments.validateComment,logic.addComment);

// //get all comments
router.get('/:postId/comments/',tokenmiddleware.verifyToken,validatePost.postIsExiected ,logic.getAllComments);
// //delete comment
router.delete('/:postId/:commentId',tokenmiddleware.verifyToken,validatePost.postIsExiected ,logic.removeComment);
// //get comment
router.get('/:postId/:commentId',tokenmiddleware.verifyToken,validatePost.postIsExiected ,logic.getComment);
//update comment

router.put('/:postId/:commentId',tokenmiddleware.verifyToken,validatePost.postIsExiected,validateComments.validateComment,logic.updateComment);



module.exports = router
