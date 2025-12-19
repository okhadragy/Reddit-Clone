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
    let { name, description, rules, userFlairs, postFlairs, tags,topics,visibility } = req.body;
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
      topics,
      visibility
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
   
    const community = await Community.findOne({ name: req.params.id })
      .populate('createdBy', 'name'); 

    if (!community) {
      return res.status(404).json({ status: 'fail', message: 'Community not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { 
        community // This object includes the _id for your frontend to use later
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateCommunity = async (req, res) => {
 
  const newIcon = req.files?.icon?.[0]?.filename;
  const newCover = req.files?.coverImage?.[0]?.filename;

  try {
    const community = await Community.findOne({ name: req.params.id })


    if (!community) {
      return res.status(404).json({ status: 'fail', message: 'Community not found' });
    }
 
    const isMod = await CommunityMember.findOne({
      community: community._id,
      user: req.userId,
      role: 'moderator'
    });

    if (!isMod) {
    
      if (newIcon) deleteUploadedFile(newIcon);
      if (newCover) deleteUploadedFile(newCover);
      return res.status(403).json({ status: 'fail', message: 'Only moderators can edit settings.' });
    }

    const oldCommunity = community
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


    const updatedCommunity = await Community.findByIdAndUpdate(community._id, updates, {
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

    const communityName = req.params.id; 

    const community = await Community.findOne({ name: communityName });

    if (!community) {
      return res.status(404).json({ status: 'fail', message: 'Community not found' });
    }


    if (community.createdBy.toString() !== req.userId) {
      return res.status(403).json({ status: 'fail', message: 'Only the community owner can delete this.' });
    }

 
    if (community.icon) deleteUploadedFile(community.icon);
    if (community.coverImage) deleteUploadedFile(community.coverImage);


    await CommunityMember.deleteMany({ community: community._id });
    

    await Community.findByIdAndDelete(community._id);

    res.status(200).json({ status: 'success', message: 'Community deleted successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const communityName = req.params.id; 

    const community = await Community.findOne({ name: communityName });

    if (!community) {
      return res.status(404).json({ status: 'fail', message: 'Community not found' });
    }

    await CommunityMember.create({
      community: community._id, 
      user: req.params.userId,
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
    const communityName = req.params.id; 
    const community = await Community.findOne({ name: communityName });

    if (!community) {
      return res.status(404).json({ status: 'fail', message: 'Community not found' });
    }

    const result = await CommunityMember.findOneAndDelete({
      community: community._id,
      user: req.params.userId
    });

    if (!result) {
      return res.status(400).json({ status: 'fail', message: 'You are not a member of this community.' });
    }

    res.status(200).json({ status: 'success', message: 'Left community successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.checkMembership = async (req, res) => {
  try {
    const  communityName  = req.params.id;

    const  userId  = req.params.userId; 

    const community = await Community.findOne({ name: communityName });
    if (!community) {
      return res.status(404).json({ status: 'fail', message: 'Community not found' });
    }


    const membership = await CommunityMember.findOne({
      community: community._id,
      user: userId
    });


    if (membership) {
      return res.status(200).json({
        status: 'success',
        isMember: true,
        role: membership.role, 
        status: membership.status 
      });
    } else {
      return res.status(200).json({
        status: 'success',
        isMember: false,
        role: 'guest'
      });
    }

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getCommunityMembers = async (req, res) => {
  try {
   
    const communityName = req.params.id; 
    const community = await Community.findOne({ name: communityName });

    if (!community) {
      return res.status(404).json({ status: 'fail', message: 'Community not found' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;


    const members = await CommunityMember.find({ community: community._id })
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
    const { id: communityName, userId: targetUserId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid User ID' });
    }

    const community = await Community.findOne({ name: communityName });
    if (!community) {
      return res.status(404).json({ status: 'fail', message: 'Community not found' });
    }

    const requesterIsMod = await CommunityMember.findOne({
      community: community._id,
      user: req.userId,
      role: 'moderator'
    });

    const isOwner = community.createdBy.toString() === req.userId;

    if (!requesterIsMod && !isOwner) {
      return res.status(403).json({ status: 'fail', message: 'Access denied. Moderators only.' });
    }
 
    if (community.createdBy.toString() === targetUserId) {
        return res.status(403).json({ 
            status: 'fail', 
            message: 'Cannot modify the community owner.' 
        });
    }
    const { role, status } = req.body;
    const updatedMember = await CommunityMember.findOneAndUpdate(
      { community: community._id, user: targetUserId },
      { role, status },
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ status: 'fail', message: 'Member not found in this community.' });
    }

    res.status(200).json({ status: 'success', data: { member: updatedMember } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


exports.getUserCommunities = async (req, res) => {
  try {
    const memberships = await CommunityMember.find({ user: req.userId })
      .populate('community', 'name icon'); 
    const communities = memberships
      .map(member => member.community)
      .filter(community => community !== null);

    res.status(200).json({
      status: 'success',
      results: communities.length,
      data: { communities }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};