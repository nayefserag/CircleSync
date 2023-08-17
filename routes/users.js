const router = require('express').Router();
const logic = require('../controllers/useroperations.js');
const tokenmiddleware = require('../middleware/tokenmiddleware.js');

//Update Profile 
router.put('/:id', tokenmiddleware.verifyToken, logic.updateuser);
// Delete Profile
router.delete('/:id', tokenmiddleware.verifyToken, logic.deleteuser);
// Get Profile
router.get('/:id', tokenmiddleware.verifyToken, logic.getUser);
//follow another user
router.post('/:id/follow', tokenmiddleware.verifyToken, logic.followuser)
//unfollow another user
router.post('/:id/unfollow', tokenmiddleware.verifyToken, logic.unfollowuser)
//get My followers list
router.get('/:id/followers', tokenmiddleware.verifyToken, logic.getfollowers)
//get My Following list
router.get('/:id/following', tokenmiddleware.verifyToken, logic.getfollowing)

module.exports = router