const asyncMiddleware = require('../middleware/async.js');
const Post = require('../models/Posts');
const User = require('../models/users');
const Comment = require('../models/comments');
const il8n = require('../Localization/il8n.js');
const FCM = require('fcm-node');
const serverKey = process.env.SERVER_KEY;
const helper = require('../helpers/helpers.js');

async function createPost(req, res) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const hashtags = helper.extractHashtags(req.body.post);


    const post =await new Post(req.body).save();
    await post.updateOne({
        $push: {
          hashtags: hashtags
        }
      });
    res.status(200).json(post);

}
async function updatePost(req, res) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const post = await Post.findById(req.params.postId)
    if (post.userId !== req.body.userId) {
        return res.status(403).json(il8n.__('Unauthorized'));
    }
    await post.updateOne({
        $set: req.body
    });
    res.status(200).json(il8n.__('Post-updated-successfully'));
}

async function deletePost(req, res) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const post = await Post.findById(req.params.postId)
    if (req.user.isAdmin) {
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        if (!deletedPost) {
            return res.status(404).json({
                message: il8n.__('Post-not-found')
            });
        }
        return res.status(200).json(il8n.__('Admin-delete-post'));
    } else if (post.userId == req.body.userId) {
        const deletedPost = await Post.findByIdAndRemove(req.params.postId)
        if (!deletedPost) {
            return res.status(404).json({
                message: il8n.__('Post-not-found')
            });
        }

        return res.status(200).json(il8n.__('Post-deleted-successfully'));
    }
    res.status(403).json({
        message: il8n.__('Unauthorized')
    });
}
async function getAllPosts(req, res) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const currentuser = await User.findById(req.body.userId);
    if (!currentuser) {
        return res.status(404).json(il8n.__('User-not-found'));
    }
    const userposts = await Post.find({
        userId: currentuser._id
    });
    const allposts = await Promise.all(
        currentuser.followings.map((friendid) => {
            return Post.find({
                userId: friendid
            }, {
                __v: 0,
                _id: 0
            });
        })
    );
    if (allposts.length === 0) {
        return res.status(404).json(il8n.__('User-dont-have-posts'));
    }
    res.status(200).send(userposts.concat(...allposts));
}
async function getPost(req, res) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const post = await Post.findById(req.params.postId, {
        __v: 0,
        _id: 0
    });

    res.status(200).json(post);
}
async function likeAndUnlikePost(req, res) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const post = await Post.findById(req.params.postId);
    const user = await User.findById(req.body.userId);
    if (!user) {
        return res.status(404).json(il8n.__('User-not-found'));
    }
    if (!post) {
        return res.status(404).json(il8n.__('Post-not-found'));
    }
    if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({
            $push: {
                likes: req.body.userId
            }
        });
        const ReciverNotification = await User.findById(req.body.userId);
        const fcm = new FCM(serverKey);
        const notificationMessage = {
            to: ReciverNotification.fcmToken,
            title: 'New Like',
            body: `${req.body.author} Liked Your post.`,
            sound: 'default',
        };
        fcm.send(notificationMessage, function (err, response) {
            if (err) {
              console.error('Error sending FCM message:', err);
            } else {
              console.log('FCM message sent successfully:', response);
            }
          });
        res.status(200).send(il8n.__('Post-liked'));
    } else {
        await post.updateOne({
            $pull: {
                likes: req.body.userId
            }
        });
        res.status(200).send(il8n.__('Post-unliked'));
    }
}
async function addComment(req, res) {
    
    il8n.setLocale(req.headers['accept-language'] || 'en');
    
    const comment = new Comment(req.body);
    const post = await Post.findById(req.params.postId);
    post.comments.push(comment);
    await post.save();

    const notifiedUser = await User.findById(post.userId);
    const fcm = new FCM(serverKey);
    const notificationMessage = {
        to: notifiedUser.fcmToken,
        title: 'New Comment',
        body: `${req.body.author} added a new comment to your post.`,
        sound: 'default',
    };
    fcm.send(notificationMessage, function (err, response) {
        if (err) {
          console.error('Error sending FCM message:', err);
        } else {
          console.log('FCM message sent successfully:', response);
        }
      });
    res.status(200).json(il8n.__('Comment-added'));
}
async function getComment(req, res) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ message: il8n.__('Comment-not-found') }); 
    }
    res.status(200).json(comment);
}
async function getAllComments(req, res) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const post = await Post.findById(req.params.postId, {
        __v: 0,
        _id: 0,
        'comments._id': 0, // Exclude _id field from comments
        'comments.createdAt': 0 // Exclude createdAt field from comments
    });

    res.status(200).json(post.comments);
}
async function updateComment(req, res) {
    const post = await Post.findById(req.params.postId);

    const commentIndex = post.comments.findIndex((c) => c._id.toString() === req.params.commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }
        post.comments.splice(commentIndex, 1);
        await post.save();
   
        const comment = new Comment(req.body);
        post.comments.push(comment);
        await post.save();

        res.status(200).json({ message: il8n.__('Comment-updated') });
}
async function removeComment(req, res) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    const commentIndex = post.comments.findIndex((c) => c._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment-not-found' });
    }
    post.comments.splice(commentIndex, 1);
    await post.save();
    res.status(200).json(il8n.__('Comment-deleted'));


}
//searching posts by hashtag
async function searchPosts(req, res) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const hashtag = req.params.hashtag

    const posts = await Post.find({
        hashtags: [hashtag]
    }
    );
    console.log(posts)

    res.status(200).send(posts);
}



module.exports = {
    createPost: asyncMiddleware(createPost),
    updatePost: asyncMiddleware(updatePost),
    getAllPosts: asyncMiddleware(getAllPosts),
    getPost: asyncMiddleware(getPost),
    likeAndUnlikePost: asyncMiddleware(likeAndUnlikePost),
    deletePost: asyncMiddleware(deletePost),
    addComment: asyncMiddleware(addComment),
    removeComment: asyncMiddleware(removeComment),
    getComment: asyncMiddleware(getComment),
    getAllComments: asyncMiddleware(getAllComments),
    updateComment: asyncMiddleware(updateComment),
    searchPosts: asyncMiddleware(searchPosts)
};