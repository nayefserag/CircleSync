const User = require('../models/users');
const helpers = require('../helpers/helpers.js');
const asyncMiddleware = require('../middleware/async.js');
const il8n = require('../Localization/il8n.js');

async function updateuser(req, res) {
  il8n.setLocale(req.headers['accept-language'] || 'en');
  if (req.body.userId === req.params.id) {
    const {
      password,
      ...otherUpdates
    } = req.body;
    if (password) {
      const hashedPassword = await helpers.hashPassword(password);
      otherUpdates.password = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: otherUpdates
    }, {
      new: true
    });
    if (!updatedUser) {
      return res.status(404).json({
        message: il8n.__('User-not-found')
      });
    }

    return res.status(200).json(il8n.__('User-updated-successfully'));
  }
  res.status(403).json({
    message: 'Unauthorized'
  });
}
async function deleteuser(req, res) {
  il8n.setLocale(req.headers['accept-language'] || 'en');
  if (req.user.isAdmin) {
    const deletedUser = await User.findByIdAndDelete(req.body.userId);
    if (!deletedUser) {
      return res.status(404).json({
        message: il8n.__('User-not-found')
      });
    }

    return res.status(200).json(il8n.__('Admin-delete'));
  }
  if (req.body.userId == req.params.id) {
    const deletedUser = await User.findByIdAndDelete(req.body.userId);
    if (!deletedUser) {
      return res.status(404).json({
        message: il8n.__('User-not-found')
      });
    }
    return res.status(200).json(il8n.__('User-deleted-successfully'));
  }
  res.status(403).json({
    message: il8n.__('Unauthorized')
  })
}

async function getUser(req, res) {
  il8n.setLocale(req.headers['accept-language'] || 'en');

  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json(il8n.__('User-not-found'));
  }
}
async function followuser(req, res) {
  il8n.setLocale(req.headers['accept-language'] || 'en');
  if (req.params.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user || !currentUser) {
        return res.status(404).send(il8n.__('User-not-found'));
      }
      if (!user.followers.includes(req.body.userId) || user.followers === null) {
        await user.updateOne({
          $push: {
            followers: req.body.userId
          }
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id
          }
        });
        res.status(200).send(il8n.__('User-followed'));
      } else {
        res.status(403).send(il8n.__('Already-followed'));
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).send(il8n.__('Follow-yourself'));
  }
}
async function unfollowuser(req, res) {
  il8n.setLocale(req.headers['accept-language'] || 'en');
  if (req.params.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user || !currentUser) {
        return res.status(404).send(il8n.__('User-not-found'));
      }
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId
          }
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id
          }
        });
        res.status(200).send(il8n.__('User-unfollowed'));
      } else {
        res.status(403).send(il8n.__('Already-unfollowed'));
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).send(il8n.__('UnFollow-yourself'));
  }
}
async function getfollowers(req, res) {
  il8n.setLocale(req.headers['accept-language'] || 'en');
  const user = await User.findById(req.params.id).select({
    followers: 1,
    _id: 0
  });
  if (!user) {
    return res.status(404).json(il8n.__('User-not-found'));
  }
  res.status(200).json(user.followers);
}
async function getfollowing(req, res) {
  il8n.setLocale(req.headers['accept-language'] || 'en');
  const user = await User.findById(req.params.id).select({
    followings: 1,
    _id: 0
  });
  if (!user) {
    return res.status(404).json(il8n.__('User-not-found'));
  }
  res.status(200).json(user.followings);
}
module.exports = {
  updateuser: asyncMiddleware(updateuser),
  deleteuser: asyncMiddleware(deleteuser),
  getUser: asyncMiddleware(getUser),
  followuser: asyncMiddleware(followuser),
  unfollowuser: asyncMiddleware(unfollowuser),
  getfollowing: asyncMiddleware(getfollowing),
  getfollowers: asyncMiddleware(getfollowers)
};