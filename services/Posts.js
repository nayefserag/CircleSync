const asyncMiddleware = require('../middleware/async.js');
const Post = require('../models/Posts');
const User = require('../models/users');
const il8n = require('../Localization/il8n.js');
//create post
async function createPost(req, res) {
    await new Post(req.body).save();
    res.status(200).json(req.body.post);
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
    const post = await Post.findById(req.params.id, {
        __v: 0,
        _id: 0
    });
    if (!post) {
        return res.status(404).json(il8n.__('Post-not-found'));
    }
    res.status(200).json(post);
}
async function likeAndUnlikePost(req, res) {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const post = await Post.findById(req.params.id);
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
module.exports = {
    createPost: asyncMiddleware(createPost),
    updatePost: asyncMiddleware(updatePost),
    getAllPosts: asyncMiddleware(getAllPosts),
    getPost: asyncMiddleware(getPost),
    likeAndUnlikePost: asyncMiddleware(likeAndUnlikePost),
    deletePost: asyncMiddleware(deletePost),
};