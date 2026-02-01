const levelRepository = require('../repositories/level.repository');
const challengeRepository = require('../repositories/challenge.repository');
const progressRepository = require('../repositories/progress.repository');
const ApiError = require('../utils/ApiError');

class LevelService {
    async getLevelById(levelId) {
        const level = await levelRepository.findById(levelId);
        if (!level) {
            throw ApiError.notFound('Level not found');
        }
        return level;
    }

    async getLevelWithChallenge(levelId, userId) {
        const level = await levelRepository.findByIdWithChallenge(levelId);
        if (!level) {
            throw ApiError.notFound('Level not found');
        }

        // Check user progress
        let progress = await progressRepository.findByUserAndLevel(userId, levelId);
        
        // If no progress exists, check if this is the first level
        if (!progress) {
            const levels = await levelRepository.findByCourseId(level.course_id);
            const isFirstLevel = levels[0]?.id === levelId;
            
            if (isFirstLevel) {
                // Create progress for first level
                progress = await progressRepository.create(userId, levelId, 'available');
            } else {
                // Check if previous level is completed
                const currentIndex = levels.findIndex(l => l.id === levelId);
                if (currentIndex > 0) {
                    const prevLevelProgress = await progressRepository.findByUserAndLevel(
                        userId, 
                        levels[currentIndex - 1].id
                    );
                    
                    if (prevLevelProgress?.status === 'completed') {
                        progress = await progressRepository.create(userId, levelId, 'available');
                    }
                }
            }
        }

        const status = progress?.status || 'locked';
        
        // Don't send challenge details if level is locked
        if (status === 'locked') {
            throw ApiError.forbidden('Complete previous level first');
        }

        return {
            ...level,
            status,
            attempts: progress?.attempts || 0,
            completed_at: progress?.completed_at || null
        };
    }

    async getNextLevel(levelId) {
        const level = await levelRepository.findById(levelId);
        if (!level) return null;
        
        return await levelRepository.getNextLevel(level.course_id, level.order_index);
    }
}

module.exports = new LevelService();
