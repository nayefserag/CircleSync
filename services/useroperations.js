const User = require('../models/users');
const helpers = require('../helpers/helpers.js');
const asyncMiddleware = require('../middleware/async.js');
const il8n = require('../Localization/il8n.js');
const FCM = require('fcm-node');
const serverKey = process.env.SERVER_KEY;

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
  const MIN_SEARCH_LENGTH = 3; 
  const identifier = req.params.id;

  // Check if the identifier is a valid ObjectId (MongoDB ID)
  if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
    const userById = await User.findById(identifier);

    if (userById) {
      res.status(200).json(userById);
    } else {
      res.status(404).json({ message: il8n.__('User-not-found') });
    }
  } else if (identifier.length >= MIN_SEARCH_LENGTH) {
    // Use regular expression to perform a case-insensitive search
    const regex = new RegExp(identifier, 'i');
    
    const usersByName = await User.find({ name: regex });

    if (usersByName.length > 0) {
      res.status(200).json(usersByName);
    } else {
      res.status(404).json({ message: il8n.__('User-not-found') });
    }
  } else {
    res.status(400).json({ message: il8n.__('Search-term-too-short') });
  }
}
async function getAllUsers(req, res){
  il8n.setLocale(req.headers['accept-language'] || 'en');
  const users = await User.find();
  res.status(200).json(users);  
}
async function followuser(req, res) {
  il8n.setLocale(req.headers['accept-language'] || 'en');

  if (req.body.userId !== req.params.id) {
      const followedUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!followedUser || !currentUser) {
        return res.status(404).send(il8n.__('User-not-found'));
      }

      if (!followedUser.followers.includes(req.body.userId) || followedUser.followers === null) {
        await followedUser.updateOne({
          $push: {
            followers: req.body.userId
          }
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id
          }
        });
        //
        if (followedUser.fcmToken.length > 0) {
          const fcm = new FCM(serverKey);
          console.log(followedUser.fcmToken)
          const message = {
            to: followedUser.fcmToken, 
            notification: {
              title: 'New Follower',
              body: `${followedUser.name} is now following you.`,
              sound: 'default',
            },
          };
          fcm.send(message, function (err, response) {
            if (err) {
              console.error('Error sending FCM message:', err);
            } else {
              console.log('FCM message sent successfully:', response);
            }
          });
        //
        res.status(200).send(il8n.__('User-followed'));
      } else {
        res.status(403).send(il8n.__('Already-followed'));
      }
  
  } else {
    res.status(401).send(il8n.__('Follow-yourself'));
  }
}
}

async function unfollowuser(req, res) {
  il8n.setLocale(req.headers['accept-language'] || 'en');
  if (req.params.userId !== req.params.id) {

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
  getfollowers: asyncMiddleware(getfollowers),
  getAllUsers: asyncMiddleware(getAllUsers)
}