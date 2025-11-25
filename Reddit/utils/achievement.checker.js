const mongoose = require('mongoose');
const Achievement = require('../models/achievement.model');
const User = require('../models/user.model');
const Community = require('../models/community.model'); 

const checkAchievement = async function(userId, context) {


    const promises = [
        User.findById(userId).lean(), 
        Achievement.find({ type: context.type }).exec()
    ];

    if (context.communityId) {
        promises.push(Community.findById(context.communityId).select('disabledAchievements').lean());
    }

    const [user, achievements, community] = await Promise.all(promises);

    if (!user || !achievements || achievements.length === 0) return;


    const earnedAchievementIds = user.achievements.map(id => id.toString());
    const disabledAchievementIds = community?.disabledAchievements?.map(id => id.toString()) || [];

    for (const achievement of achievements) {
        const achievementIdString = achievement._id.toString();


        if (earnedAchievementIds.includes(achievementIdString)) continue;

     
        if (disabledAchievementIds.includes(achievementIdString)) {
            continue; 
        }
        
        let conditionMet = false;

        switch(achievement.type){
            case 'post':
                if(user.posts.length >= achievement.condition.posts){
                    conditionMet = true;
                }
                break;

            case 'comment':

                 if(user.comments?.length >= achievement.condition.comments){
                    conditionMet = true;
                }
                break;

            case 'karma':
                if(achievement.condition.posts && user.postKarma >= achievement.condition.posts){
                    conditionMet = true;
                }
                else if(achievement.condition.comments && user.commentKarma >= achievement.condition.comments){
                    conditionMet = true;
                }
                else if(achievement.condition.total && (user.postKarma + user.commentKarma) >= achievement.condition.total){
                    conditionMet = true;
                }
                break;

            case 'community':

                if (achievement.condition.joinedCount) {
   
                    const CommunityMember = require('../models/communityMember.model');
                    const joinedCount = await CommunityMember.countDocuments({ user: userId }); 
                    if (joinedCount >= achievement.condition.joinedCount) {
                        conditionMet = true;
                    }
                }
                else if (achievement.condition.isModerator) {
                    const CommunityMember = require('../models/communityMember.model');
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
};

module.exports = checkAchievement;