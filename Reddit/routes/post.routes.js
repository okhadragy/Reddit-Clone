const express = require("express");
const postControllers = require("../controllers/post.controller");
const uploadTo = require("../middleware/image.upload.middleware");
const multerErrorHandler = require("../middleware/multer.error.handler");
const { protectRoutes } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .post(
    protectRoutes,
    uploadTo("posts").array("media", 5), // up to 5 files
    multerErrorHandler,
    postControllers.createPost
  )
  .get(protectRoutes, postControllers.getAllPosts);

router
  .route("/:id")
  .get(protectRoutes, postControllers.getPost);

router
  .route("/:id/vote")
  .post(protectRoutes, postControllers.votePost);

module.exports = router;
