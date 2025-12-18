const Community = require('../models/community.model');
const CommunityMember = require('../models/membership.model');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


const deleteUploadedFile = (filename) => {

  if (!filename || filename === 'icon.png' || filename === 'community.png') return;
  
  const filePath = path.join(__dirname, '../uploads/communities', filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};


exports.createCommunity = async (req, res) => {
  const uploadedIcon = req.files?.icon?.[0]?.filename;
  const uploadedCover = req.files?.coverImage?.[0]?.filename;

  try {
    let { name, description, rules, userFlairs, postFlairs, tags,topics } = req.body;
    if (typeof rules === 'string') rules = JSON.parse(rules);
    if (typeof userFlairs === 'string') userFlairs = JSON.parse(userFlairs);
    if (typeof postFlairs === 'string') postFlairs = JSON.parse(postFlairs);
    if (typeof tags === 'string') tags = JSON.parse(tags);
    if (typeof topics === 'string') topics = JSON.parse(topics);

    const reservedNames = ['admin', 'mod', 'reddit', 'help', 'support'];
    if (reservedNames.includes(name?.toLowerCase())) {
      throw new Error('This community name is reserved and cannot be used.');
    }

    const newCommunity = await Community.create({
      name,
      description,
      icon: uploadedIcon || 'icon.png',
      coverImage: uploadedCover || 'community.png',
      createdBy: req.userId,
      rules,
      userFlairs,
      postFlairs,
      tags,
      topics
    });

    await CommunityMember.create({
      community: newCommunity._id,
      user: req.userId,
      role: 'moderator',
      status: 'approved'
    });

    res.status(201).json({
      status: 'success',
      data: { community: newCommunity }
    });

  } catch (error) {

    if (uploadedIcon) deleteUploadedFile(uploadedIcon);
    if (uploadedCover) deleteUploadedFile(uploadedCover);


    if (error.code === 11000) {
      return res.status(400).json({ 
        status: 'fail', 
        message: `The community name "${req.body.name}" is already taken.` 
      });
    }

    if (error instanceof SyntaxError) {
        return res.status(400).json({ status: 'fail', message: 'Invalid JSON format for rules/flairs.' });
    }

    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getAllCommunities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
    }

    const communities = await Community.find(query)
      .select('name icon description membersCount tags') 
      .skip(skip)
      .limit(limit);

    const total = await Community.countDocuments(query);

    res.status(200).json({ 
        status: 'success', 
        results: communities.length, 
        total,
        totalPages: Math.ceil(total / limit),
        data: { communities } 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getCommunity = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid Community ID' });
    }

    const community = await Community.findById(req.params.id)
      .populate('createdBy', 'name'); 

    if (!community) {
      return res.status(404).json({ status: 'fail', message: 'Community not found' });
    }

    res.status(200).json({ status: 'success', data: { community } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateCommunity = async (req, res) => {
 
  const newIcon = req.files?.icon?.[0]?.filename;
  const newCover = req.files?.coverImage?.[0]?.filename;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new Error('Invalid Community ID');
    }

 
    const isMod = await CommunityMember.findOne({
      community: req.params.id,
      user: req.userId,
      role: 'moderator'
    });

    if (!isMod) {
    
      if (newIcon) deleteUploadedFile(newIcon);
      if (newCover) deleteUploadedFile(newCover);
      return res.status(403).json({ status: 'fail', message: 'Only moderators can edit settings.' });
    }

    const oldCommunity = await Community.findById(req.params.id);
    if (!oldCommunity) throw new Error('Community not found');

    const updates = { ...req.body };
    

    if (newIcon) updates.icon = newIcon;
    if (newCover) updates.coverImage = newCover;
    if (typeof updates.rules === 'string') updates.rules = JSON.parse(updates.rules);
    if (typeof updates.userFlairs === 'string') updates.userFlairs = JSON.parse(updates.userFlairs);
    if (typeof updates.postFlairs === 'string') updates.postFlairs = JSON.parse(updates.postFlairs);
    if (typeof updates.tags === 'string') updates.tags = JSON.parse(updates.tags);
    if (typeof updates.allowedPostTypes === 'string') updates.allowedPostTypes = JSON.parse(updates.allowedPostTypes);
    if (typeof updates.disabledAchievements === 'string') updates.disabledAchievements = JSON.parse(updates.disabledAchievements);


    const updatedCommunity = await Community.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (newIcon && oldCommunity.icon) deleteUploadedFile(oldCommunity.icon);
    if (newCover && oldCommunity.coverImage) deleteUploadedFile(oldCommunity.coverImage);

    res.status(200).json({ status: 'success', data: { community: updatedCommunity } });

  } catch (error) {
    if (newIcon) deleteUploadedFile(newIcon);
    if (newCover) deleteUploadedFile(newCover);

    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid Community ID' });
    }
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ status: 'fail', message: 'Community not found' });

    if (community.createdBy.toString() !== req.userId) {
      return res.status(403).json({ status: 'fail', message: 'Only the community owner can delete this.' });
    }

    deleteUploadedFile(community.icon);
    deleteUploadedFile(community.coverImage);

    await CommunityMember.deleteMany({ community: communityId });
    await Community.findByIdAndDelete(communityId);

    res.status(200).json({ status: 'success', message: 'Community deleted successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};



exports.joinCommunity = async (req, res) => {
  try {
    const { id: communityId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid Community ID' });
    }

    const community = await Community.exists({ _id: communityId });
    if (!community) return res.status(404).json({ status: 'fail', message: 'Community not found' });

    await CommunityMember.create({
      community: communityId,
      user: req.userId,
      role: 'member'
    });

    res.status(200).json({ status: 'success', message: 'Joined successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'You are already a member.' });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.leaveCommunity = async (req, res) => {
  try {
    const { id: communityId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid Community ID' });
    }

    const result = await CommunityMember.findOneAndDelete({
      community: communityId,
      user: req.userId
    });

    if (!result) {
      return res.status(400).json({ status: 'fail', message: 'You are not a member of this community.' });
    }

    res.status(200).json({ status: 'success', message: 'Left community successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getCommunityMembers = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid Community ID' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const members = await CommunityMember.find({ community: req.params.id })
      .populate('user', 'name photo')
      .populate('selectedFlair', 'text backgroundColor textColor')
      .skip(skip)
      .limit(limit);

    res.status(200).json({ status: 'success', results: members.length, data: { members } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


exports.manageMember = async (req, res) => {
  try {
    const { id: communityId, userId: targetUserId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(communityId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid IDs' });
    }
    const requesterIsMod = await CommunityMember.findOne({
      community: communityId,
      user: req.userId,
      role: 'moderator'
    });

    if (!requesterIsMod) {
      return res.status(403).json({ status: 'fail', message: 'Access denied. Moderators only.' });
    }
    
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ status: 'fail', message: 'Community not found' });
    
    if (community.createdBy.toString() === targetUserId) {
        return res.status(403).json({ 
            status: 'fail', 
            message: 'Cannot modify the community owner.' 
        });
    }


    const { role, status } = req.body;
    const updatedMember = await CommunityMember.findOneAndUpdate(
      { community: communityId, user: targetUserId },
      { role, status },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ status: 'fail', message: 'Member not found.' });
    }

    res.status(200).json({ status: 'success', data: { member: updatedMember } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};