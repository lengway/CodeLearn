const userService = require('../services/user.service');
const progressService = require('../services/progress.service');
const catchAsync = require('../utils/catchAsync');

const getProfile = catchAsync(async (req, res) => {
    const userId = req.user.id;
    
    const profile = await userService.getProfile(userId);
    
    res.json({
        success: true,
        data: profile
    });
});

const getProgress = catchAsync(async (req, res) => {
    const userId = req.user.id;
    
    const progress = await progressService.getUserProgress(userId);
    
    res.json({
        success: true,
        data: progress
    });
});

const getLeaderboard = catchAsync(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = await userService.getLeaderboard(limit);
    
    res.json({
        success: true,
        data: leaderboard
    });
});

const updateProfile = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { username } = req.body;
    
    const profile = await userService.updateProfile(userId, { username });
    
    res.json({
        success: true,
        data: profile
    });
});

module.exports = { getProfile, getProgress, getLeaderboard, updateProfile };
