const db = require('../config/database');

class CourseRepository {
    async findAll() {
        const result = await db.query(
            `SELECT c.*, 
                    COUNT(l.id) as total_levels
             FROM courses c
             LEFT JOIN levels l ON c.id = l.course_id
             WHERE c.is_published = true
             GROUP BY c.id
             ORDER BY c.created_at DESC`
        );
        return result.rows;
    }

    async findById(id) {
        const result = await db.query(
            'SELECT * FROM courses WHERE id = $1 AND is_published = true',
            [id]
        );
        return result.rows[0];
    }

    async findByIdWithLevels(id) {
        const courseResult = await db.query(
            'SELECT * FROM courses WHERE id = $1 AND is_published = true',
            [id]
        );
        
        if (!courseResult.rows[0]) return null;
        
        const levelsResult = await db.query(
            `SELECT l.id, l.order_index, l.title, l.xp_reward,
                    c.id as challenge_id
             FROM levels l
             LEFT JOIN challenges c ON l.id = c.level_id
             WHERE l.course_id = $1
             ORDER BY l.order_index ASC`,
            [id]
        );
        
        return {
            ...courseResult.rows[0],
            levels: levelsResult.rows
        };
    }
}

module.exports = new CourseRepository();
