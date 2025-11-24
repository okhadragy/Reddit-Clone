const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const adminUserRoutes = require('./routes/admin.user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const communityRoutes = require('./routes/community.routes');
const cors = require("cors");
const path = require("path")

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectDB();
app.use('/users', userRoutes);
app.use('/admin/users', adminUserRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/community',communityRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
