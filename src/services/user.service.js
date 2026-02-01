const userRepository = require('../repositories/user.repository');
const { calculateLevel, getXpProgress, getLevelTitle } = require('../utils/xpCalculator');
const ApiError = require('../utils/ApiError');

class UserService {
    async getProfile(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw ApiError.notFound('User not found');
        }

        const xpData = getXpProgress(user.xp);
        const levelTitle = getLevelTitle(xpData.currentLevel);

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            xp: user.xp,
            level: xpData.currentLevel,
            levelTitle,
            xpProgress: xpData,
            createdAt: user.created_at
        };
    }

    async getLeaderboard(limit = 10) {
        const users = await userRepository.getLeaderboard(limit);
        
        return users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            xp: user.xp,
            level: calculateLevel(user.xp),
            levelTitle: getLevelTitle(calculateLevel(user.xp))
        }));
    }

    async updateProfile(userId, updateData) {
        const { username } = updateData;

        if (!username || username.length < 3 || username.length > 50) {
            throw ApiError.badRequest('Username must be 3-50 characters');
        }

        const updated = await userRepository.updateProfile(userId, { username });
        if (!updated) {
            throw ApiError.notFound('User not found');
        }

        const xpData = getXpProgress(updated.xp);
        const levelTitle = getLevelTitle(xpData.currentLevel);

        return {
            id: updated.id,
            email: updated.email,
            username: updated.username,
            xp: updated.xp,
            level: xpData.currentLevel,
            levelTitle,
            xpProgress: xpData,
            updatedAt: updated.updated_at
        };
    }
}

module.exports = new UserService();
