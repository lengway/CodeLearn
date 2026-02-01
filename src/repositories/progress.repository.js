const db = require('../config/database');

class ProgressRepository {
    async findByUserAndLevel(userId, levelId) {
        const result = await db.query(
            'SELECT * FROM user_progress WHERE user_id = $1 AND level_id = $2',
            [userId, levelId]
        );
        return result.rows[0];
    }

    async findByUser(userId) {
        const result = await db.query(
            `SELECT up.*, l.title as level_title, l.order_index, 
                    l.course_id, c.title as course_title
             FROM user_progress up
             JOIN levels l ON up.level_id = l.id
             JOIN courses c ON l.course_id = c.id
             WHERE up.user_id = $1
             ORDER BY c.title, l.order_index`,
            [userId]
        );
        return result.rows;
    }

    async findByUserAndCourse(userId, courseId) {
        const result = await db.query(
            `SELECT up.*, l.title as level_title, l.order_index, l.xp_reward
             FROM user_progress up
             JOIN levels l ON up.level_id = l.id
             WHERE up.user_id = $1 AND l.course_id = $2
             ORDER BY l.order_index`,
            [userId, courseId]
        );
        return result.rows;
    }

    async create(userId, levelId, status = 'available') {
        const result = await db.query(
            `INSERT INTO user_progress (user_id, level_id, status) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (user_id, level_id) DO NOTHING
             RETURNING *`,
            [userId, levelId, status]
        );
        return result.rows[0];
    }

    async updateStatus(userId, levelId, status) {
        const completedAt = status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL';
        const result = await db.query(
            `UPDATE user_progress 
             SET status = $1, 
                 completed_at = ${status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL'}
             WHERE user_id = $2 AND level_id = $3
             RETURNING *`,
            [status, userId, levelId]
        );
        return result.rows[0];
    }

    async incrementAttempts(userId, levelId) {
        const result = await db.query(
            `UPDATE user_progress 
             SET attempts = attempts + 1 
             WHERE user_id = $1 AND level_id = $2
             RETURNING *`,
            [userId, levelId]
        );
        return result.rows[0];
    }

    async markCompleted(userId, levelId) {
        const result = await db.query(
            `UPDATE user_progress 
             SET status = 'completed', completed_at = CURRENT_TIMESTAMP 
             WHERE user_id = $1 AND level_id = $2
             RETURNING *`,
            [userId, levelId]
        );
        return result.rows[0];
    }

    async getCompletedCount(userId, courseId) {
        const result = await db.query(
            `SELECT COUNT(*) as count
             FROM user_progress up
             JOIN levels l ON up.level_id = l.id
             WHERE up.user_id = $1 AND l.course_id = $2 AND up.status = 'completed'`,
            [userId, courseId]
        );
        return parseInt(result.rows[0].count);
    }
}

module.exports = new ProgressRepository();
