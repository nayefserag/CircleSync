// const User = require('../models/users');
// const helpers = require('../helpers/helpers.js');
// const handler = require('../middleware/async.js');
const {updateuser, getUser, getfollowers, getfollowing, followuser, unfollowuser,deleteuser,getAllUsers} =require('../services/useroperations.js');
//Update user
exports.updateuser = updateuser;
// Delete my account (Admin can delete also)
exports.deleteuser = deleteuser;
// Get My profile or friend profile
exports.getUser = getUser;
//follow user
exports.followuser = followuser;
// unfollow user
exports.unfollowuser = unfollowuser;
// get My followers list
exports.getfollowers = getfollowers;
// get My following list
exports.getfollowing = getfollowing;

// get all users
exports.getAllUsers = getAllUsers;
