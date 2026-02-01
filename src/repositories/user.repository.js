const db = require('../config/database');

class UserRepository {
    async findById(id) {
        const result = await db.query(
            'SELECT id, email, username, xp, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    async findByEmail(email) {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    async create(userData) {
        const { email, username, passwordHash } = userData;
        const result = await db.query(
            `INSERT INTO users (email, username, password_hash) 
             VALUES ($1, $2, $3) 
             RETURNING id, email, username, xp, created_at`,
            [email, username, passwordHash]
        );
        return result.rows[0];
    }

    async updateXp(userId, xpToAdd) {
        const result = await db.query(
            `UPDATE users SET xp = xp + $1 WHERE id = $2 
             RETURNING id, email, username, xp`,
            [xpToAdd, userId]
        );
        return result.rows[0];
    }

    async getLeaderboard(limit = 10) {
        const result = await db.query(
            `SELECT id, username, xp, created_at 
             FROM users 
             ORDER BY xp DESC 
             LIMIT $1`,
            [limit]
        );
        return result.rows;
    }

    async updateProfile(userId, updateData) {
        const { username } = updateData;
        const result = await db.query(
            `UPDATE users SET username = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 
             RETURNING id, email, username, xp, created_at, updated_at`,
            [username, userId]
        );
        return result.rows[0];
    }
}

module.exports = new UserRepository();
