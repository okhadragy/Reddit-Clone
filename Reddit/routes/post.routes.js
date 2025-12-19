const express = require("express");
const postControllers = require("../controllers/post.controller");
const uploadTo = require("../middleware/image.upload.middleware");
const multerErrorHandler = require("../middleware/multer.error.handler");
const { protectRoutes, getUserIdRoutes } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .post(
    protectRoutes,
    uploadTo("posts").array("media", 5), // up to 5 files
    multerErrorHandler,
    postControllers.createPost
  )
  .get(
    getUserIdRoutes,
    postControllers.getAllPosts
  );

router
  .route("/:id")
  .get(
    getUserIdRoutes,
    postControllers.getPost
  )
  .patch(
    protectRoutes, 
    uploadTo("posts").array("media", 5), // up to 5 files
    multerErrorHandler,
    postControllers.updatePost
  )
  .delete(
    protectRoutes, 
    postControllers.deletePost
  );
router
  .route("/:id/vote")
  .post(
    protectRoutes, 
    postControllers.votePost
  );
router
  .route("/:id/save")
  .post(
    protectRoutes, 
    postControllers.toggleSavePost
  );
module.exports = router;
