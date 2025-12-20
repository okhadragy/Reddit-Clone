const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const adminUserRoutes = require('./routes/admin.user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const communityRoutes = require('./routes/community.routes');
const customFeedRoutes = require('./routes/customFeed.routes');
const chatRoutes = require('./routes/chats.routes');
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5000',
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/users', userRoutes);
app.use('/admin/users', adminUserRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/community',communityRoutes);
app.use('/feeds', customFeedRoutes);
app.use('/chats', chatRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5000',
  }
});
io.use(require("./middleware/socketAuth"));
require('./socket')(io);

(async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();

