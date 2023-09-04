const Joi = require('joi');
const Post = require('../models/Posts.js');
const il8n = require('../Localization/il8n.js');
//validation for post
exports.validatePosts = (req, res, next) => {+
    console.log(req.body);
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const { error } = validatePost(req.body);
    if (error) {
     console.error(error.details[0].message);
     res.status(500).json(il8n.__('Post-is-invalid'));
    }

    else{
        next();
    }
}


exports.postIsExiected = async (req, res, next) => {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const post =  await Post.findById(req.params.postId)
        if (post) {
            next();
        } else {
            res.status(404).json({ message: il8n.__('Post-not-found') });
        }
};

function validatePost(post) {
    
    const schema = Joi.object({
        userId: Joi.string().required(),
        post: Joi.string().min(1).max(750).required(),
        Image: Joi.string(),
    });

    return schema.validate(post);
}