const {createPost,updatePost,deletePost,getAllPosts,getPost,likeAndUnlikePost} = require('../services/Posts.js');
//create post
exports.createPost = createPost;
// async (req, res, next) => {
//     try {
//         console.log(req.body);
//         new Post(req.body).save();
//         res.status(200).json(req.body.post);

//     } catch (error) {
//         next(error);

//     }
// }
exports.deletePost =deletePost;
//Update post
exports.updatePost = updatePost;
// async (req, res, next) => {
//     try {
//         const post = await Post.findById(req.params.postId)
//         if (post.userId !== req.body.userId) {
//             return res.status(403).json("Unauthorized");
//         }
//         await post.updateOne({
//             $set: req.body
//         });
//         res.status(200).json("Updated successfully");
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };

// //delete post
// exports.deletePost = async (req, res, next) => {
//     try {
//         const post = await Post.findById(req.params.postId)
//         if (req.user.isAdmin) {
//             const deletedPost = await Post.findByIdAndDelete(req.params.postId);
//             if (!deletedPost) {
//                 return res.status(404).json({
//                     message: 'Post not found'
//                 });
//             }
//             return res.status(200).json('Admin has been deleted This Post successfully');
//         } else if (post.userId == req.body.userId) {
//             const deletedPost = await Post.findByIdAndRemove(req.params.postId)
//             if (!deletedPost) {
//                 return res.status(404).json({
//                     message: 'Post not founds'
//                 });
//             }

//             return res.status(200).json('Your Post has been deleted successfully');
//         }
//         res.status(403).json({
//             message: 'Unauthorized'
//         });

//     } catch (error) {
//         next(error);
//     }
// };

//get my timeline (My posts and my friend posts)
exports.getAllPosts = getAllPosts;
// async (req, res, next) => {

//     try {
//         const currentuser = await User.findById(req.body.userId);
//         if (!currentuser) {
//             return res.status(404).json("User not found");
//         }
//         const userposts = await Post.find({
//             userId: currentuser._id
//         });
//         const allposts = await Promise.all(
//             currentuser.followings.map((friendid) => {
//                 return Post.find({
//                     userId: friendid
//                 }, {
//                     __v: 0,
//                     _id: 0
//                 });
//             })
//         );
//         if (allposts.length === 0) {
//             return res.status(404).json("User dont have any posts");
//         }
//         res.status(200).send(userposts.concat(...allposts));
//     } catch (error) {
//         next(error);
//     }
// }

//get single post
exports.getPost = getPost;
// async (req, res, next) => {
//     try {
//         const post = await Post.findById(req.params.id, {
//             __v: 0,
//             _id: 0
//         });
//         if (!post) {
//             return res.status(404).json("Post not found");
//         }
//         res.status(200).json(post);
//     } catch (error) {
//         next(error);
//     }
// }

//like & unlike post 
exports.likeAndUnlikePost = likeAndUnlikePost;
// async (req, res, next) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         const user = await User.findById(req.body.userId);
//         if (!user) {
//             return res.status(404).json("User not found");
//         }
//         if (!post) {
//             return res.status(404).json("Post not found");
//         }
//         if (!post.likes.includes(req.body.userId)) {
//             await post.updateOne({
//                 $push: {
//                     likes: req.body.userId
//                 }
//             });
//             res.status(200).send("liked");
//         } else {
//             await post.updateOne({
//                 $pull: {
//                     likes: req.body.userId
//                 }
//             });
//             res.status(200).send("unliked");
//         }
//     } catch (error) {
//         next(error);
//     }
// }
