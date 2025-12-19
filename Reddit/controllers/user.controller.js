const User = require("../models/user.model");
const Achievement = require("../models/achievement.model");
const checkAchievement = require('../utils/achievement.checker');
const Post = require("../models/post.model");
const Community = require("../models/community.model");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const deleteUploadedFile = (folder, filename, defaultFile) => {
  if (filename && filename !== defaultFile) {
    const filePath = path.join(__dirname, `../uploads/${folder}`, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

const signup = async (req, res) => {
  const uploadedPhoto = req.files?.photo?.[0]?.filename || "profile.png";
  const uploadedBanner = req.files?.banner?.[0]?.filename || "banner.png";

  try {
    let {email, password, confirmPassword, role, name  } = req.body;

    role = role || "user"; // default role

    // Only admin can create admin
    if (role === "admin" && req.userRole !== "admin") {
      deleteUploadedFile("profiles", uploadedPhoto, "profile.png");
      deleteUploadedFile("banners", uploadedBanner, "banner.png");
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to create admin users",
      });
    }

    // Validate password
    if (password !== confirmPassword) {
      deleteUploadedFile("profiles", uploadedPhoto, "profile.png");
      deleteUploadedFile("banners", uploadedBanner, "banner.png");
      return res.status(400).json({ status: "fail", message: "Passwords do not match" });
    }

    // Check if user exists
    const existingUsername = await User.findOne({ name });
    if (existingUsername) {
      deleteUploadedFile("profiles", uploadedPhoto, "profile.png");
      deleteUploadedFile("banners", uploadedBanner, "banner.png");
      return res.status(400).json({ status: "fail", message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      deleteUploadedFile("profiles", uploadedPhoto, "profile.png");
      deleteUploadedFile("banners", uploadedBanner, "banner.png");
      return res.status(400).json({ status: "fail", message: "Email already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      photo: uploadedPhoto,
      banner: uploadedBanner,
      role,
    });

    const token = JWT.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: "success",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
        banner: user.banner,
        id: user._id
      },
    });
  } catch (error) {
    //deleteUploadedFile("profiles", uploadedPhoto, "profile.png");
    //deleteUploadedFile("banners", uploadedBanner, "banner.png");
    console.error("DETAILED SIGNUP ERROR:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};


const login = async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or username

  if (!identifier || !password) {
    return res.status(400).json({ status: "fail", message: "Email/Username or password missing" });
  }

  // Find by email OR username
  const user = await User.findOne({
    $or: [{ email: identifier }, { name: identifier }]
  }).select("+password");

  if (!user) {
    return res.status(404).json({ status: "fail", message: "User does not exist" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ status: "fail", message: "Incorrect email/username or password" });
  }

  const token = JWT.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({
    status: "success",
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
      banner: user.banner,
      id: user._id
    },
  });
};



const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword)
      return res.status(400).json({ status: "fail", message: "Missing password fields" });

    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ status: "fail", message: "New passwords do not match" });

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ status: "fail", message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const getUsernames = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const search = req.query.search?.trim();

    // Build search filter
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select("name") // only what frontend needs
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: "success",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      results: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const resolveUser = async (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return await User.findById(identifier);
  }
  return await User.findOne({ name: identifier });
};



const getUserProfile = async (req, res) => {
  try {
    const requesterId = req.userId;
    const requesterRole = req.userRole;

    const identifier = req.params.idOrName; // could be ID or username
    if (!identifier) {
      return res.status(400).json({ status: "fail", message: "User identifier is required" });
    }

    // Resolve user by ID or name
    const userDoc = await resolveUser(identifier);
    if (!userDoc) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    const includes = req.query.include?.split(",").map(i => i.trim()) || [];

    const user = await User.findById(userDoc._id)
      .select("name about photo banner followers following achievements showFollowersCount createdAt role savedPosts postKarma commentKarma")
      .populate(includes.includes("achievements") ? "achievements" : "")
      .lean();

    const targetUserId = user._id.toString();
    const isSelf = requesterId === targetUserId;
    const isAdmin = requesterRole === "admin";

    user.followersCount = user.showFollowersCount ? user.followers?.length || 0 : undefined;
    user.followingCount = user.following?.length || 0;

    if (!isAdmin && !isSelf) {
      delete user.followers;
      delete user.following;
      delete user.role;
      delete user.savedPosts;
    }

    const queries = [];

    // Posts
    if (includes.includes("posts")) {
      queries.push(
        Post.find({ author: targetUserId })
          .select("title mediaType community upvotes downvotes createdAt")
          .populate("community", "name coverImage")
          .populate("author", "name photo")
          .lean()
          .then(posts => (user.posts = posts))
      );
    }

    // Comments
    if (includes.includes("comments")) {
      queries.push(
        Post.aggregate([
          { $unwind: "$comments" },
          { $match: { "comments.user": new mongoose.Types.ObjectId(targetUserId) } },
          { $project: { postId: "$_id", postTitle: "$title", comment: "$comments", community: "$community", author: "$author" } }
        ]).then(async comments => {
          const communityIds = [...new Set(comments.map(c => c.community))];
          const authorIds = [...new Set(comments.map(c => c.author))];

          const [communities, authors] = await Promise.all([
            Community.find({ _id: { $in: communityIds } }).select("name coverImage").lean(),
            User.find({ _id: { $in: authorIds } }).select("name photo").lean(),
          ]);

          const communityMap = Object.fromEntries(communities.map(c => [c._id.toString(), c]));
          const authorMap = Object.fromEntries(authors.map(a => [a._id.toString(), a]));

          user.comments = comments.map(c => ({
            postId: c.postId,
            postTitle: c.postTitle,
            text: c.comment.text,
            createdAt: c.comment.createdAt,
            community: communityMap[c.community?.toString()],
            author: authorMap[c.author?.toString()],
          }));
        })
      );
    }

    // Saved / Upvoted / Downvoted
    if ((includes.includes("saved") || includes.includes("upvoted") || includes.includes("downvoted")) && (isAdmin || isSelf)) {
      if (includes.includes("saved")) {
        queries.push(
          Post.find({ _id: { $in: user.savedPosts || [] } })
            .select("title mediaType community author createdAt")
            .populate("community", "name coverImage")
            .populate("author", "name photo")
            .lean()
            .then(saved => (user.saved = saved))
        );
      }

      if (includes.includes("upvoted")) {
        queries.push(
          Post.find({ upvotes: targetUserId })
            .select("title mediaType community author createdAt")
            .populate("community", "name coverImage")
            .populate("author", "name photo")
            .lean()
            .then(upvoted => (user.upvoted = upvoted))
        );
      }

      if (includes.includes("downvoted")) {
        queries.push(
          Post.find({ downvotes: targetUserId })
            .select("title mediaType community author createdAt")
            .populate("community", "name coverImage")
            .populate("author", "name photo")
            .lean()
            .then(downvoted => (user.downvoted = downvoted))
        );
      }
    }

    await Promise.all(queries);
    delete user.savedPosts;

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const requesterId = req.userId;
    const requesterRole = req.userRole;

    const identifier = requesterRole === "admin"
      ? req.params.idOrName
      : requesterId;

    const user = await resolveUser(identifier);
    if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

    if (req.files?.photo) req.body.photo = req.files.photo[0].filename;
    if (req.files?.banner) req.body.banner = req.files.banner[0].filename;

    if (requesterRole !== "admin") delete req.body.role;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      req.body,
      { new: true, runValidators: true, select: "-password -__v" }
    );
    
    await checkAchievement(user._id, { type: "custom" });

    if (req.files?.photo && user.photo && user.photo !== "profile.png")
      deleteUploadedFile("profiles", user.photo, "profile.png");

    if (req.files?.banner && user.banner && user.banner !== "banner.png")
      deleteUploadedFile("banners", user.banner, "banner.png");

    res.status(200).json({ status: "success", data: updatedUser });

  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: "fail",
        message: `${duplicateField} already exists`
      });
    }
    console.error("Error updating user:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const requesterRole = req.userRole;
    const identifier = requesterRole === "admin"
      ? req.params.idOrName
      : req.userId;

    const user = await resolveUser(identifier);
    if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

    await User.findByIdAndDelete(user._id);

    if (user.photo && user.photo !== "profile.png")
      deleteUploadedFile("profiles", user.photo, "profile.png");

    if (user.banner && user.banner !== "banner.png")
      deleteUploadedFile("banners", user.banner, "banner.png");

    res.status(200).json({ status: "success", message: "User deleted successfully" });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};


const toggleFollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const target = await resolveUser(req.params.idOrName);

    if (!target) return res.status(404).json({ status: "fail", message: "User not found" });
    if (user._id.equals(target._id))
      return res.status(400).json({ status: "fail", message: "You cannot follow yourself" });

    const isFollowing = user.following.includes(target._id);

    if (isFollowing) {
      user.following.pull(target._id);
      target.followers.pull(user._id);
    } else {
      user.following.push(target._id);
      target.followers.push(user._id);
    }

    await Promise.all([user.save(), target.save()]);

    res.status(200).json({
      status: "success",
      message: isFollowing ? "Unfollowed user" : "Followed user"
    });

  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};


const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().select('-__v');

    res.status(200).json({
      status: 'success',
      results: achievements.length,
      data: { achievements }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};

const createAchievement = async (req, res) => {
  const uploadedIcon = req.file?.filename;

  try {
    let { title, description, type, condition } = req.body;


    if (typeof condition === 'string') {
      try {
        condition = JSON.parse(condition);
      } catch (e) {
        deleteUploadedFile('achievements', uploadedIcon, 'default-badge.png');
        return res.status(400).json({ status: 'fail', message: 'Invalid JSON format for achievement condition.' });
      }
    }

    // Set the icon path based on the upload or the default
    const icon = uploadedIcon || 'default-badge.png';

    const newAchievement = await Achievement.create({
      title,
      description,
      icon,
      type: type || 'custom',
      condition: condition || {},
    });

    res.status(201).json({ status: 'success', data: { achievement: newAchievement } });

  } catch (error) {

    deleteUploadedFile('achievements', uploadedIcon, 'default-badge.png');
    res.status(400).json({ status: 'fail', message: error.message });
  }
};



const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Achievement ID' });
    }

    const achievement = await Achievement.findByIdAndDelete(id);
    if (!achievement) {
      return res.status(404).json({ status: 'fail', message: 'Achievement not found' });
    }

    deleteUploadedFile('achievements', achievement.icon, 'default-badge.png');
    await User.updateMany({ $pull: { achievements: id } });

    res.status(200).json({ status: 'success', message: 'Achievement deleted successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  signup,
  login,
  changePassword,
  getUsernames,
  getAllUsers,
  getUserProfile,
  updateUser,
  deleteUser,
  toggleFollowUser,
  getAllAchievements,
  createAchievement,
  deleteAchievement
};
