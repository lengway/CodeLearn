const db = require('../config/database');

class SubmissionRepository {
    async create(submissionData) {
        const {
            userId, challengeId, code, languageId, 
            judge0Token, status, stdout, stderr, 
            compileOutput, executionTime, memoryUsed, isCorrect
        } = submissionData;
        
        const result = await db.query(
            `INSERT INTO submissions 
             (user_id, challenge_id, code, language_id, judge0_token, 
              status, stdout, stderr, compile_output, execution_time, 
              memory_used, is_correct)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             RETURNING *`,
            [userId, challengeId, code, languageId, judge0Token,
             status, stdout, stderr, compileOutput, executionTime,
             memoryUsed, isCorrect]
        );
        return result.rows[0];
    }

    async findByToken(token) {
        const result = await db.query(
            'SELECT * FROM submissions WHERE judge0_token = $1',
            [token]
        );
        return result.rows[0];
    }

    async findByUserAndChallenge(userId, challengeId, limit = 10) {
        const result = await db.query(
            `SELECT * FROM submissions 
             WHERE user_id = $1 AND challenge_id = $2
             ORDER BY created_at DESC
             LIMIT $3`,
            [userId, challengeId, limit]
        );
        return result.rows;
    }

    async update(id, data) {
        const { status, stdout, stderr, compileOutput, executionTime, memoryUsed, isCorrect } = data;
        const result = await db.query(
            `UPDATE submissions 
             SET status = $1, stdout = $2, stderr = $3, compile_output = $4,
                 execution_time = $5, memory_used = $6, is_correct = $7
             WHERE id = $8
             RETURNING *`,
            [status, stdout, stderr, compileOutput, executionTime, memoryUsed, isCorrect, id]
        );
        return result.rows[0];
    }

    async hasCorrectSubmission(userId, challengeId) {
        const result = await db.query(
            `SELECT EXISTS(
                SELECT 1 FROM submissions 
                WHERE user_id = $1 AND challenge_id = $2 AND is_correct = true
             ) as has_correct`,
            [userId, challengeId]
        );
        return result.rows[0].has_correct;
    }
}

module.exports = new SubmissionRepository();
