const Joi = require('joi');
const User = require('../models/users');
const il8n = require('../Localization/il8n.js');
//validation for post
exports.validationUser = (req, res, next) => {
    const { error } = validateUser(req.body);
    if (error) {
     console.error(error.details[0].message);
     res.status(500).json(error.message);
    }
  
    else{

        next();
    }
}


exports.checkUserExists = async function(req, res, next) {
  il8n.setLocale(req.headers['accept-language'] || 'en');
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: il8n.__('Email-already-exist') });
    }
    next();
    
    
  } catch (error) {
    res.status(500).json({ error:  il8n.__('An-error-occurred')  });
  }
};
exports.checkuserLoginRgister = async function(req, res, next) {
  il8n.setLocale(req.headers['accept-language'] || 'en');
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (!existingUser) {
        return res.status(400).json({ error: il8n.__('Email-or-password-is-invalid') });
      }

next();
    }
    catch (error) {
      res.status(500).json({ error: il8n.__('An-error-occurred') });
    }
  };
  function validateUser(user) {
      const schema = Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
          profilePicture: Joi.string(),
          coverPicture: Joi.string(),
          isAdmin: Joi.boolean(),
          description: Joi.string(),
          city: Joi.string().max(50),
          from: Joi.string().max(50),
          relationship: Joi.number().valid(1, 2, 3),
          fcmToken: Joi.string(),
      });
  
      return schema.validate(user);
  }
