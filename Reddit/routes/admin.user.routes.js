const express = require("express");
const userControllers = require("../controllers/user.controller");
const uploadTo = require('../middleware/image.upload.middleware');
const multerErrorHandler = require('../middleware/multer.error.handler');
const { protectRoutes } = require('../middleware/auth');
const restrictTo = require('../middleware/roles');
const router = express.Router();

router
  .route('/')
  .get(
    protectRoutes,
    restrictTo("admin"),
    userControllers.getAllUsers
  )
  .post(
    protectRoutes,
    restrictTo("admin"),
    uploadTo('profiles').fields([
      { name: 'photo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
    multerErrorHandler,
    userControllers.signup
  );

  router
  .route('/achievements')
  .get(
    protectRoutes,
    restrictTo("admin"),
    userControllers.getAllAchievements
  )
  .post( 
    protectRoutes,
    restrictTo("admin"),
    uploadTo('achievements').single('icon'), 
    multerErrorHandler, 
    userControllers.createAchievement 
 )
  .delete(
    protectRoutes,
    restrictTo("admin"),
    userControllers.deleteAchievement
  );
  

router
  .route('/:id')
  .get(
    protectRoutes,
    restrictTo("admin"),
    userControllers.getUserProfile
  )
  .patch(
    protectRoutes,
    restrictTo("admin"),
    uploadTo('profiles').fields([
      { name: 'photo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
    multerErrorHandler,
    userControllers.updateUser
  )
  .delete(
    protectRoutes,
    restrictTo("admin"),
    userControllers.deleteUser
  );

  
module.exports = router;
