const levelService = require('../services/level.service');
const catchAsync = require('../utils/catchAsync');

const getLevelById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    const level = await levelService.getLevelWithChallenge(id, userId);
    
    res.json({
        success: true,
        data: level
    });
});

module.exports = { getLevelById };
