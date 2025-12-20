const Chat = require("./models/chat.model");
const Message = require("./models/message.model");

module.exports = function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.userId);

    socket.join(socket.userId); // personal room

    // Send message
    socket.on("send_message", async ({ chatId, text }) => {
      const message = await Message.create({
        chat: chatId,
        sender: socket.userId,
        text
      });

      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: text,
        updatedAt: Date.now()
      });

      const populated = await message.populate("sender", "name");

      io.to(chatId).emit("new_message", populated);
    });

    // Join chat room
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });
  });
};
