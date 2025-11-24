const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Achievement = require('../models/achievement.model');
const User = require('../models/user.model');
const Community = require('../models/community.model'); 



const checkAchievement=async function(userId,context){

    const [user, achievements] = await Promise.all([
        User.findById(userId).lean(), 
        Achievement.find({ type: context.type }).exec(), 
    ]);

    if (!user || achievements.length === 0) return;



    for (const achievement of achievements) {
        const isEarned = user.achievements.includes(achievement._id);
        if (isEarned) continue;

        if (context.communityId) {
            const community = await Community.findById(context.communityId).select('disabledAchievements');
            if (community?.disabledAchievements?.includes(achievement._id)) {
                continue; 
            }
        }
        let conditionMet=false;
        switch(achievement.type){
            case 'post':
                if(user.posts.length >= achievement.condition.posts){
                    conditionMet=true;
                }
                break;
            case 'comment':
                 if(user.comments.length >= achievement.condition.comments){
                    conditionMet=true;
                }
                 
                break;

            case 'karma':
               
                if(achievement.condition.posts && user.postKarma >= achievement.condition.posts){
      
                    conditionMet=true;
                }
            
        
                else if(achievement.condition.comments&&user.commentKarma >= achievement.condition.comments){
             
                    conditionMet=true;
                }

            
        
                if(achievement.condition.total&&user.postKarma+user.commentKarma >= achievement.condition.total){
             
                    conditionMet=true;
                }

                break;
            case 'community':
                if (achievement.condition.joinedCount) {
                    const joinedCount = await CommunityMember.countDocuments({ user: userId }); 
                    if (joinedCount >= achievement.condition.joinedCount) {
                        conditionMet = true;
                    }
                }
                
                else if (achievement.condition.isModerator) {
                    const isMod = await CommunityMember.exists({ user: userId, role: 'moderator' });
                    if (isMod) {
                        conditionMet = true;
                    }
                }
                break;
            case 'custom':
                const rules = achievement.condition; 
                if (rules.hasPhoto) {
                    if (user.photo && user.photo !== 'profile.png') {
                        conditionMet = true;
                    }
                }
                else if (rules.hasBio) {
                    if (user.about && user.about.length > 0) {
                        conditionMet = true;
                    }
                }
                else if (rules.emailVerified) {
                    if (user.isEmailVerified === true) {
                        conditionMet = true;
                    }
                }
                else if (rules.profilePerfectionist) {
                    const hasPhoto = user.photo && user.photo !== 'profile.png';
                    const hasBio = user.about && user.about.length > 0;
                    const hasBanner = user.banner && user.banner !== 'banner.png';
                    
                    if (hasPhoto && hasBio && hasBanner) {
                        conditionMet = true;
                    }
                }
                break;
        }

        if (conditionMet) {
            await User.findByIdAndUpdate(userId, { 
                $addToSet: { achievements: achievement._id } 
            });
        }

    }





}

module.exports=checkAchievement
