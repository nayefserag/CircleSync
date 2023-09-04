const Joi = require('joi');
const Post = require('../models/Posts.js');
const Comments = require('../models/comments.js');
const il8n = require('../Localization/il8n.js');

exports.validateComment = (req, res, next) => {
    il8n.setLocale(req.headers['accept-language'] || 'en');
    const { error } = validateComment(req.body);
    if (error) {
        console.error(error.details[0].message);
        res.status(500).json(il8n.__('Comment-is-invalid'));
    }
    else{
        next();
    }
}



function validateComment(comment) {
    const schema = Joi.object({
        author: Joi.string().required(),
        text: Joi.string().required().min(1),

    
    });
    return schema.validate(comment);
}