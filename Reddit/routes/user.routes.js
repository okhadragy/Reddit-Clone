const express = require("express");
const userControllers = require("../controllers/user.controller");
const uploadTo = require('../middleware/image.upload.middleware');
const multerErrorHandler = require('../middleware/multer.error.handler');
const { protectRoutes, preventLoggedInAccess } = require('../middleware/auth');
const router = express.Router();

router
  .route('/signup')
  .post(
    preventLoggedInAccess,
    uploadTo('profiles').fields([
      { name: 'photo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
    multerErrorHandler,
    userControllers.signup
  );
router
  .route('/login')
  .post(
    preventLoggedInAccess,
    userControllers.login
  );
router
  .route('/change-password')
  .post(
    protectRoutes,
    userControllers.changePassword
  );
router
  .route('/:id')
  .get(
    protectRoutes,
    userControllers.getUserProfile
  )
  .patch(
    protectRoutes,
    uploadTo('profiles').fields([
      { name: 'photo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
    multerErrorHandler,
    userControllers.updateUser
  )
  .delete(
    protectRoutes,
    userControllers.deleteUser
  );
router
  .route('/:id/follow')
  .get(
    protectRoutes,
    userControllers.toggleFollowUser
  )
module.exports = router;
