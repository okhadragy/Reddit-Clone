const express = require("express");
const commentControllers = require("../controllers/comment.controller");
const { protectRoutes } = require("../middleware/auth");

const router = express.Router();

router
  .route("/post/:postId")
  .post(protectRoutes, commentControllers.addComment);

router
  .route("/:commentId")
  .patch(protectRoutes, commentControllers.updateComment)
  .delete(protectRoutes, commentControllers.deleteComment);

router
  .route("/:commentId/vote")
  .post(protectRoutes, commentControllers.voteComment);

module.exports = router;
