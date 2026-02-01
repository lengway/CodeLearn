const db = require('../config/database');

class LevelRepository {
    async findById(id) {
        const result = await db.query(
            `SELECT l.*, c.title as course_title, c.language as course_language
             FROM levels l
             JOIN courses c ON l.course_id = c.id
             WHERE l.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async findByIdWithChallenge(id) {
        const levelResult = await db.query(
            `SELECT l.*, c.title as course_title, c.language as course_language
             FROM levels l
             JOIN courses c ON l.course_id = c.id
             WHERE l.id = $1`,
            [id]
        );
        
        if (!levelResult.rows[0]) return null;
        
        const challengeResult = await db.query(
            `SELECT id, description, starter_code, language_id, 
                    time_limit, memory_limit
             FROM challenges 
             WHERE level_id = $1`,
            [id]
        );
        
        return {
            ...levelResult.rows[0],
            challenge: challengeResult.rows[0] || null
        };
    }

    async findByCourseId(courseId) {
        const result = await db.query(
            `SELECT l.*, 
                    ch.id as challenge_id
             FROM levels l
             LEFT JOIN challenges ch ON l.id = ch.level_id
             WHERE l.course_id = $1
             ORDER BY l.order_index ASC`,
            [courseId]
        );
        return result.rows;
    }

    async getNextLevel(courseId, currentOrderIndex) {
        const result = await db.query(
            `SELECT id FROM levels 
             WHERE course_id = $1 AND order_index = $2`,
            [courseId, currentOrderIndex + 1]
        );
        return result.rows[0];
    }

    async getPreviousLevel(courseId, currentOrderIndex) {
        const result = await db.query(
            `SELECT id FROM levels 
             WHERE course_id = $1 AND order_index = $2`,
            [courseId, currentOrderIndex - 1]
        );
        return result.rows[0];
    }
}

module.exports = new LevelRepository();
