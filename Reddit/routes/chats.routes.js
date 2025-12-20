const express = require("express");
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const { protectRoutes } = require('../middleware/auth');
const router = express.Router();

router.get("/", protectRoutes, async (req, res) => {
  const chats = await Chat.find({ participants: req.userId })
    .populate("participants", "name photo")
    .sort({ updatedAt: -1 });
  res.json({
    status: "success",
    data: chats,
  });
});

router.post("/", protectRoutes, async (req, res) => {
  const { userId } = req.body;

  // Check if chat already exists
  let chat = await Chat.findOne({
    participants: { $all: [req.userId, userId] },
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [req.userId, userId],
    });
  }

  chat = await chat.populate("participants", "name photo");

  res.json({
    status: "success",
    data: chat,
  });
});


router.get("/:id/messages", protectRoutes, async (req, res) => {
  const messages = await Message.find({ chat: req.params.id })
    .populate("sender", "name");

  res.json({
    status: "success",
    data: messages,
  });

});


module.exports = router;
