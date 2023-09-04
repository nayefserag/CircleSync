const {createPost,updatePost,deletePost,getAllPosts,getPost,likeAndUnlikePost,addComment,removeComment,getComment,getAllComments ,updateComment,searchPosts} = require('../services/Posts.js');
//create post
exports.createPost = createPost;
//Update post
exports.updatePost = updatePost;
// //delete post
exports.deletePost =deletePost;
//get my timeline (My posts and my friend posts)
exports.getAllPosts = getAllPosts;
//get post
exports.getPost = getPost;
//like and unlike post
exports.likeAndUnlikePost = likeAndUnlikePost;
//add comment
exports.addComment = addComment;
//delete comment
exports.removeComment = removeComment;
//get comment
exports.getComment = getComment;
//get all comments
exports.getAllComments = getAllComments;
//update comment
exports.updateComment = updateComment;
//search by hashtag
exports.searchPosts = searchPosts;