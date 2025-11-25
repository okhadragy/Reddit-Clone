const User = require("../models/user.model");
const Achievement=require("../models/achievement.model");
const checkAchievement = require('../utils/achievement.checker');
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
    let { name, password, confirmPassword, email, role, jobTitle } = req.body;
    role = role || "student";

    const allowedRolesForSignup = ["student", "instructor"];

    if (role === "admin" && (!req.userRole || req.userRole !== "admin")) {
      deleteUploadedFile("profiles", req.files?.photo?.[0]?.filename, "profile.png");
      deleteUploadedFile("banners", req.files?.banner?.[0]?.filename, "banner.png");
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to create admin users",
      });
    } else if (!allowedRolesForSignup.includes(role) && role !== "admin") {
      deleteUploadedFile("profiles", req.files?.photo?.[0]?.filename, "profile.png");
      deleteUploadedFile("banners", req.files?.banner?.[0]?.filename, "banner.png");
      return res.status(400).json({
        status: "fail",
        message: `Role must be one of: ${allowedRolesForSignup.join(", ")}`,
      });
    }

    if (password !== confirmPassword) {
      deleteUploadedFile("profiles", req.files?.photo?.[0]?.filename, "profile.png");
      deleteUploadedFile("banners", req.files?.banner?.[0]?.filename, "banner.png");
      return res.status(400).json({ status: "fail", message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      deleteUploadedFile("profiles", req.files?.photo?.[0]?.filename, "profile.png");
      deleteUploadedFile("banners", req.files?.banner?.[0]?.filename, "banner.png");
      return res.status(400).json({ status: "fail", message: "User already exists" });
    }

    const userData = {
      name,
      email,
      password,
      photo: uploadedPhoto,
      banner: uploadedBanner,
      role
    };

    if (role === "instructor" && jobTitle) userData.jobTitle = jobTitle;

    const user = await User.create(userData);

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
        banner: user.banner
      }
    });
  } catch (error) {
    deleteUploadedFile("profiles", req.files?.photo?.[0]?.filename, "profile.png");
    deleteUploadedFile("banners", req.files?.banner?.[0]?.filename, "banner.png");
    res.status(400).json({ status: "fail", message: `Error in sign up: ${error.message}` });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ status: "fail", message: "Email or Password is missing" });

  const existingUser = await User.findOne({ email });
  if (!existingUser)
    return res.status(404).json({ status: "fail", message: "User does not exist" });

  const isMatch = await bcrypt.compare(password, existingUser.password);
  if (!isMatch)
    return res.status(401).json({ status: "fail", message: "Incorrect email or password" });

  const token = JWT.sign(
    { id: existingUser._id, name: existingUser.name, role: existingUser.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return res.status(200).json({
    status: "success",
    token,
    user: {
      name: existingUser.name,
      role: existingUser.role,
      email: existingUser.email,
      photo: existingUser.photo,
      banner: existingUser.banner
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

const getUserProfile = async (req, res) => {
  try {
    const requesterId = req.userId;
    const requesterRole = req.userRole;
    const targetUserId = req.params.id || requesterId;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ status: "fail", message: "Invalid User ID" });
    }

    // Parse ?include=posts,comments,saved,...
    const includes = req.query.include?.split(",").map(i => i.trim()) || [];

    // Basic user info (always returned)
    const user = await User.findById(targetUserId)
      .select("name about photo banner followers following achievements showFollowersCount createdAt role")
      .populate(includes.includes("achievements") ? "achievements" : "")
      .lean();

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    const isSelf = requesterId === targetUserId.toString();
    const isAdmin = requesterRole === "admin";

    user.followersCount = user.showFollowersCount ? user.followers?.length || 0 : undefined;
    user.followingCount = user.following?.length || 0;

    if (!isAdmin && !isSelf) {
      delete user.followers;
      delete user.following;
      delete user.role;
    }

    const queries = [];

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

    if (includes.includes("comments")) {
      queries.push(
        Post.aggregate([
          { $unwind: "$comments" },
          { $match: { "comments.user": new mongoose.Types.ObjectId(targetUserId) } },
          {
            $project: {
              postId: "$_id",
              postTitle: "$title",
              comment: "$comments",
              community: "$community",
              author: "$author",
            },
          },
        ])
          .then(async comments => {
            const communityIds = [...new Set(comments.map(c => c.community).filter(Boolean))];
            const authorIds = [...new Set(comments.map(c => c.author).filter(Boolean))];

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

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const requesterId = req.userId;
    const requesterRole = req.userRole;
    const userId = requesterRole === "admin" ? req.params.id : requesterId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: "fail", message: "Invalid User ID" });
    }

    const oldUser = await User.findById(userId);
    if (!oldUser) return res.status(404).json({ status: "fail", message: "User not found" });

    if (req.files?.photo) req.body.photo = req.files.photo[0].filename;
    if (req.files?.banner) req.body.banner = req.files.banner[0].filename;

    if (requesterRole !== "admin" && req.body.role) delete req.body.role;

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
      select: "-password -__v"
    });
    await checkAchievement(userId, { type: 'custom' });

    if (req.files?.photo && oldUser.photo && oldUser.photo !== "profile.png")
      deleteUploadedFile("profiles", oldUser.photo, "profile.png");

    if (req.files?.banner && oldUser.banner && oldUser.banner !== "banner.png")
      deleteUploadedFile("banners", oldUser.banner, "banner.png");

    res.status(200).json({ status: "success", data: updatedUser });
  } catch (error) {
    console.error("Error updating User:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const requesterId = req.userId;
    const requesterRole = req.userRole;
    const userId = requesterRole === 'admin' ? req.params.id : requesterId;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ status: "fail", message: "Invalid User ID" });

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser)
      return res.status(404).json({ status: "fail", message: "User not found" });

    if (deletedUser.photo && deletedUser.photo !== "profile.png")
      deleteUploadedFile("profiles", deletedUser.photo, "profile.png");

    if (deletedUser.banner && deletedUser.banner !== "banner.png")
      deleteUploadedFile("banners", deletedUser.banner, "banner.png");

    res.status(200).json({ status: "success", message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting User:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const toggleFollowUser = async (req, res) => {
  try {
    const userId = req.userId;
    const targetId = req.params.id;

    if (userId === targetId)
      return res.status(400).json({ status: "fail", message: "You cannot follow yourself" });

    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!target) return res.status(404).json({ status: "fail", message: "Target user not found" });

    const isFollowing = user.following?.includes(targetId);
    if (isFollowing) {
      user.following.pull(targetId);
      target.followers.pull(userId);
      await Promise.all([user.save(), target.save()]);
      return res.status(200).json({ status: "success", message: "Unfollowed user" });
    } else {
      user.following.push(targetId);
      target.followers.push(userId);
      await Promise.all([user.save(), target.save()]);
      return res.status(200).json({ status: "success", message: "Followed user" });
    }
  } catch (error) {
    console.error("Error in toggleFollowUser:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getAllAchievements = async (req, res) => {try {
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
  getUserProfile,
  updateUser,
  deleteUser,
  toggleFollowUser,
  getAllAchievements,
  createAchievement,
  deleteAchievement
};
