const progressRepository = require('../repositories/progress.repository');
const levelRepository = require('../repositories/level.repository');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/ApiError');

class ProgressService {
    async getUserProgress(userId) {
        return await progressRepository.findByUser(userId);
    }

    async getProgressByCourse(userId, courseId) {
        return await progressRepository.findByUserAndCourse(userId, courseId);
    }

    async initializeCourseProgress(userId, courseId) {
        const levels = await levelRepository.findByCourseId(courseId);
        
        if (levels.length > 0) {
            // Check if already initialized
            const existing = await progressRepository.findByUserAndLevel(userId, levels[0].id);
            if (!existing) {
                await progressRepository.create(userId, levels[0].id, 'available');
            }
        }
    }

    async completeLevel(userId, levelId) {
        const level = await levelRepository.findById(levelId);
        if (!level) {
            throw ApiError.notFound('Level not found');
        }

        // Check if already completed
        const progress = await progressRepository.findByUserAndLevel(userId, levelId);
        if (progress?.status === 'completed') {
            return { alreadyCompleted: true, xpAwarded: 0 };
        }

        // Mark as completed
        await progressRepository.markCompleted(userId, levelId);

        // Award XP
        const user = await userRepository.updateXp(userId, level.xp_reward);

        // Unlock next level
        const nextLevel = await levelRepository.getNextLevel(level.course_id, level.order_index);
        if (nextLevel) {
            await progressRepository.create(userId, nextLevel.id, 'available');
        }

        return {
            alreadyCompleted: false,
            xpAwarded: level.xp_reward,
            newTotalXp: user.xp,
            nextLevelId: nextLevel?.id || null
        };
    }

    async incrementAttempts(userId, levelId) {
        return await progressRepository.incrementAttempts(userId, levelId);
    }
}

module.exports = new ProgressService();
