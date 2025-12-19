const express = require('express');
const communityController = require("../controllers/community.controller");
const { protectRoutes } = require('../middleware/auth');
const uploadTo = require('../middleware/image.upload.middleware');
const multerErrorHandler = require('../middleware/multer.error.handler');

const router = express.Router();


router.route('/')
  .post(
    protectRoutes, 
    uploadTo('communities').fields([ 
      { name: 'icon', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 }
    ]),
    multerErrorHandler, 
    communityController.createCommunity 
  )
  .get(communityController.getAllCommunities);

router.get('/joined', protectRoutes, communityController.getUserCommunities);


  router.route('/:id')
  .get(communityController.getCommunity) 
  .patch(
    protectRoutes, 
    uploadTo('communities').fields([{ name: 'icon', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 }]), 
    multerErrorHandler, 
    communityController.updateCommunity 
  )
  .delete(
    protectRoutes, 
    communityController.deleteCommunity
  );

router.post('/:id/join/:userId', protectRoutes, communityController.joinCommunity);
router.post('/:id/leave/:userId', protectRoutes, communityController.leaveCommunity);
router.get('/:id/checkMember/:userId', communityController.checkMembership);
router.get('/:id/members', communityController.getCommunityMembers);

router.patch('/:id/members/:userId', protectRoutes, communityController.manageMember);

module.exports = router;