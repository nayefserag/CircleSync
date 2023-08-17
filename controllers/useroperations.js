// const User = require('../models/users');
// const helpers = require('../helpers/helpers.js');
// const handler = require('../middleware/async.js');
const {updateuser, getUser, getfollowers, getfollowing, followuser, unfollowuser,deleteuser} =require('../services/useroperations.js');
//Update user
exports.updateuser = updateuser;
// async (req, res) => {

//   try {
//     if (req.body.userId === req.params.id) {
//       const {
//         password,
//         ...otherUpdates
//       } = req.body;
//       if (password) {
//         const hashedPassword = await helpers.hashPassword(password);
//         otherUpdates.password = hashedPassword;
//       }
//       const updatedUser = await User.findByIdAndUpdate(req.params.id, {
//         $set: otherUpdates
//       }, {
//         new: true
//       });
//       if (!updatedUser) {
//         return res.status(404).json({
//           message: 'User not found'
//         });
//       }

//       return res.status(200).json('Your account has been updated successfully');
//     }
//     res.status(403).json({
//       message: 'Unauthorized'
//     });

//   } catch (error) {
//     res.status(500).json(error.message);
//     console.log(error);
//   }
// };


// Delete my account (Admin can delete also)
exports.deleteuser = deleteuser;
// async (req, res, next) => {
//   try {
//     if (req.user.isAdmin) {
//       const deletedUser = await User.findByIdAndDelete(req.body.userId);
//       if (!deletedUser) {
//         return res.status(404).json({
//           message: 'User not found'
//         });
//       }

//       return res.status(200).json('Admin has been deleted This User successfully');
//     }
//     if (req.body.userId == req.params.id) {
//       const deletedUser = await User.findByIdAndDelete(req.body.userId);
//       if (!deletedUser) {
//         return res.status(404).json({
//           message: 'User not found'
//         });
//       }

//       return res.status(200).json('Your account has been deleted successfully');
//     }
//     res.status(403).json({
//       message: 'Unauthorized'
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// Get My profile or friend profile
exports.getUser = getUser;
// async (req, res) => {

//   const user = await User.findById(req.params.id);
//   if (user) {
//     res.status(200).json(user);
//   } else {
//     res.status(404).json('User not found');
//   }
// }

//follow user
exports.followuser = followuser;
//  async (req, res) => {
//   if (req.params.userId !== req.params.id) {
//     try {
//       const user = await User.findById(req.params.id);
//       const currentUser = await User.findById(req.body.userId);
//       if (!user || !currentUser) {
//         return res.status(404).send("User not found");
//       }
//       if (!user.followers.includes(req.body.userId) || user.followers === null) {
//         await user.updateOne({
//           $push: {
//             followers: req.body.userId
//           }
//         });
//         await currentUser.updateOne({
//           $push: {
//             followings: req.params.id
//           }
//         });
//         res.status(200).send("User followed");
//       } else {
//         res.status(403).send("You are already following this user");
//       }
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     res.status(401).send('You cannot follow yourself');
//   }
// }

// unfollow user
exports.unfollowuser = unfollowuser;
// async (req, res, next) => {
//   if (req.params.userId !== req.params.id) {
//     try {
//       const user = await User.findById(req.params.id);
//       const currentUser = await User.findById(req.body.userId);
//       if (!user || !currentUser) {
//         return res.status(404).send("User not found");
//       }
//       if (user.followers.includes(req.body.userId)) {
//         await user.updateOne({
//           $pull: {
//             followers: req.body.userId
//           }
//         });
//         await currentUser.updateOne({
//           $pull: {
//             followings: req.params.id
//           }
//         });
//         res.status(200).send("User unfollowed");
//       } else {
//         res.status(403).send("You are already unfollow this user");
//       }
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     res.status(401).send('You cannot unfollow yourself');
//   }
// }

// get My followers list
exports.getfollowers = getfollowers;
// async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id).select({
//       followers: 1,
//       _id: 0
//     });
//     if (!user) {
//       return res.status(404).json("User not found");
//     }
//     res.status(200).json(user.followers);
//   } catch (error) {
//     next(error);
//   }
// }

// get My following list
exports.getfollowing = getfollowing;
// async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id).select({
//       followings: 1,
//       _id: 0
//     });
//     if (!user) {
//       return res.status(404).json("User not found");
//     }
//     res.status(200).json(user.followings);
//   } catch (error) {
//     next(error);
//   }
// }