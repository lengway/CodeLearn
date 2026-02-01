const db = require('../config/database');

class ChallengeRepository {
    async findById(id) {
        const result = await db.query(
            'SELECT * FROM challenges WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    async findByLevelId(levelId) {
        const result = await db.query(
            'SELECT * FROM challenges WHERE level_id = $1',
            [levelId]
        );
        return result.rows[0];
    }

    async getExpectedOutput(challengeId) {
        const result = await db.query(
            'SELECT expected_output, test_input FROM challenges WHERE id = $1',
            [challengeId]
        );
        return result.rows[0];
    }
}

module.exports = new ChallengeRepository();
