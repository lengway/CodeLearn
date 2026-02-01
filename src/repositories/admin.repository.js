const db = require('../config/database');

class AdminRepository {
    // ============ COURSES ============
    
    async getAllCourses() {
        const result = await db.query(
            `SELECT c.*, 
                    COUNT(DISTINCT l.id) as total_levels,
                    COUNT(DISTINCT up.user_id) as enrolled_users
             FROM courses c
             LEFT JOIN levels l ON c.id = l.course_id
             LEFT JOIN user_progress up ON l.id = up.level_id
             GROUP BY c.id
             ORDER BY c.created_at DESC`
        );
        return result.rows;
    }

    async getCourseById(id) {
        const result = await db.query(
            'SELECT * FROM courses WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    async createCourse(data) {
        const { title, description, language, difficulty, image_url, is_published } = data;
        const result = await db.query(
            `INSERT INTO courses (title, description, language, difficulty, image_url, is_published)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [title, description, language, difficulty || 'beginner', image_url, is_published !== false]
        );
        return result.rows[0];
    }

    async updateCourse(id, data) {
        const { title, description, language, difficulty, image_url, is_published } = data;
        const result = await db.query(
            `UPDATE courses 
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 language = COALESCE($3, language),
                 difficulty = COALESCE($4, difficulty),
                 image_url = COALESCE($5, image_url),
                 is_published = COALESCE($6, is_published)
             WHERE id = $7
             RETURNING *`,
            [title, description, language, difficulty, image_url, is_published, id]
        );
        return result.rows[0];
    }

    async deleteCourse(id) {
        const result = await db.query(
            'DELETE FROM courses WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }

    // ============ LEVELS ============

    async getLevelsByCourse(courseId) {
        const result = await db.query(
            `SELECT l.*, 
                    ch.id as challenge_id,
                    ch.description as challenge_description,
                    ch.language_id
             FROM levels l
             LEFT JOIN challenges ch ON l.id = ch.level_id
             WHERE l.course_id = $1
             ORDER BY l.order_index ASC`,
            [courseId]
        );
        return result.rows;
    }

    async getLevelById(id) {
        const result = await db.query(
            `SELECT l.*, 
                    ch.id as challenge_id,
                    ch.description as challenge_description,
                    ch.starter_code,
                    ch.language_id,
                    ch.expected_output,
                    ch.test_input,
                    ch.time_limit,
                    ch.memory_limit
             FROM levels l
             LEFT JOIN challenges ch ON l.id = ch.level_id
             WHERE l.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async createLevel(data) {
        const { course_id, order_index, title, theory_content, xp_reward } = data;
        
        // Get max order_index if not provided
        let orderIdx = order_index;
        if (!orderIdx) {
            const maxResult = await db.query(
                'SELECT COALESCE(MAX(order_index), 0) + 1 as next_index FROM levels WHERE course_id = $1',
                [course_id]
            );
            orderIdx = maxResult.rows[0].next_index;
        }

        const result = await db.query(
            `INSERT INTO levels (course_id, order_index, title, theory_content, xp_reward)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [course_id, orderIdx, title, theory_content, xp_reward || 10]
        );
        return result.rows[0];
    }

    async updateLevel(id, data) {
        const { title, theory_content, xp_reward, order_index } = data;
        const result = await db.query(
            `UPDATE levels 
             SET title = COALESCE($1, title),
                 theory_content = COALESCE($2, theory_content),
                 xp_reward = COALESCE($3, xp_reward),
                 order_index = COALESCE($4, order_index)
             WHERE id = $5
             RETURNING *`,
            [title, theory_content, xp_reward, order_index, id]
        );
        return result.rows[0];
    }

    async deleteLevel(id) {
        const result = await db.query(
            'DELETE FROM levels WHERE id = $1 RETURNING id, course_id, order_index',
            [id]
        );
        
        // Reorder remaining levels
        if (result.rows[0]) {
            await db.query(
                `UPDATE levels 
                 SET order_index = order_index - 1 
                 WHERE course_id = $1 AND order_index > $2`,
                [result.rows[0].course_id, result.rows[0].order_index]
            );
        }
        
        return result.rows[0];
    }

    async reorderLevels(courseId, levelOrders) {
        // levelOrders: [{ id: uuid, order_index: number }, ...]
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            
            for (const level of levelOrders) {
                await client.query(
                    'UPDATE levels SET order_index = $1 WHERE id = $2 AND course_id = $3',
                    [level.order_index, level.id, courseId]
                );
            }
            
            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // ============ CHALLENGES ============

    async getChallengeByLevelId(levelId) {
        const result = await db.query(
            'SELECT * FROM challenges WHERE level_id = $1',
            [levelId]
        );
        return result.rows[0];
    }

    async createChallenge(data) {
        const { 
            level_id, description, starter_code, language_id, 
            expected_output, test_input, time_limit, memory_limit 
        } = data;
        
        const result = await db.query(
            `INSERT INTO challenges 
             (level_id, description, starter_code, language_id, expected_output, test_input, time_limit, memory_limit)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [level_id, description, starter_code || '', language_id, expected_output, test_input || '', time_limit || 2.0, memory_limit || 128000]
        );
        return result.rows[0];
    }

    async updateChallenge(id, data) {
        const { 
            description, starter_code, language_id, 
            expected_output, test_input, time_limit, memory_limit 
        } = data;
        
        const result = await db.query(
            `UPDATE challenges 
             SET description = COALESCE($1, description),
                 starter_code = COALESCE($2, starter_code),
                 language_id = COALESCE($3, language_id),
                 expected_output = COALESCE($4, expected_output),
                 test_input = COALESCE($5, test_input),
                 time_limit = COALESCE($6, time_limit),
                 memory_limit = COALESCE($7, memory_limit)
             WHERE id = $8
             RETURNING *`,
            [description, starter_code, language_id, expected_output, test_input, time_limit, memory_limit, id]
        );
        return result.rows[0];
    }

    async deleteChallenge(id) {
        const result = await db.query(
            'DELETE FROM challenges WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }

    async upsertChallenge(levelId, data) {
        const existing = await this.getChallengeByLevelId(levelId);
        
        if (existing) {
            return this.updateChallenge(existing.id, data);
        } else {
            return this.createChallenge({ ...data, level_id: levelId });
        }
    }

    // ============ STATISTICS ============

    async getStats() {
        const result = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM courses) as total_courses,
                (SELECT COUNT(*) FROM levels) as total_levels,
                (SELECT COUNT(*) FROM submissions) as total_submissions,
                (SELECT COUNT(*) FROM submissions WHERE is_correct = true) as correct_submissions,
                (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_week
        `);
        return result.rows[0];
    }

    async getRecentSubmissions(limit = 20) {
        const result = await db.query(
            `SELECT s.*, u.username, l.title as level_title
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             JOIN challenges ch ON s.challenge_id = ch.id
             JOIN levels l ON ch.level_id = l.id
             ORDER BY s.created_at DESC
             LIMIT $1`,
            [limit]
        );
        return result.rows;
    }

    // ============ USERS ============

    async getAllUsers(limit = 50, offset = 0) {
        const result = await db.query(
            `SELECT id, email, username, role, xp, created_at,
                    (SELECT COUNT(*) FROM submissions WHERE user_id = users.id) as total_submissions,
                    (SELECT COUNT(*) FROM user_progress WHERE user_id = users.id AND status = 'completed') as completed_levels
             FROM users
             ORDER BY created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    }

    async updateUserRole(userId, role) {
        const result = await db.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, username, role',
            [role, userId]
        );
        return result.rows[0];
    }
}

module.exports = new AdminRepository();
