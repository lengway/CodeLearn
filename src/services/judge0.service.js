const axios = require('axios');
const judge0Config = require('../config/judge0');
const challengeRepository = require('../repositories/challenge.repository');
const submissionRepository = require('../repositories/submission.repository');
const progressService = require('./progress.service');
const levelRepository = require('../repositories/level.repository');
const ApiError = require('../utils/ApiError');

class Judge0Service {
    constructor() {
        this.client = axios.create({
            baseURL: judge0Config.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                ...(judge0Config.apiKey && { 'X-Auth-Token': judge0Config.apiKey })
            }
        });
    }

    async submitCode(userId, challengeId, sourceCode, languageId) {
        // Get challenge details
        const challenge = await challengeRepository.findById(challengeId);
        if (!challenge) {
            throw ApiError.notFound('Challenge not found');
        }

        // Get level for progress tracking
        const level = await levelRepository.findById(challenge.level_id);

        // Increment attempts
        await progressService.incrementAttempts(userId, level.id);

        // Prepare submission for Judge0
        const submission = {
            source_code: Buffer.from(sourceCode).toString('base64'),
            language_id: languageId || challenge.language_id,
            stdin: challenge.test_input ? Buffer.from(challenge.test_input).toString('base64') : null,
            expected_output: Buffer.from(challenge.expected_output).toString('base64'),
            cpu_time_limit: challenge.time_limit,
            memory_limit: challenge.memory_limit
        };

        try {
            // Submit to Judge0
            const response = await this.client.post('/submissions?base64_encoded=true&wait=false', submission);
            const token = response.data.token;

            // Save submission to database
            await submissionRepository.create({
                userId,
                challengeId,
                code: sourceCode,
                languageId: languageId || challenge.language_id,
                judge0Token: token,
                status: 'pending'
            });

            return { token, levelId: level.id };
        } catch (error) {
            console.error('Judge0 submission error:', error.response?.data || error.message);
            throw ApiError.internal('Failed to submit code for evaluation');
        }
    }

    async getSubmissionResult(token, userId) {
        try {
            const response = await this.client.get(
                `/submissions/${token}?base64_encoded=true&fields=status,stdout,stderr,compile_output,time,memory,token,status_id`
            );

            const result = response.data;
            
            // Decode base64 fields
            const decoded = {
                token: result.token,
                status: result.status,
                statusId: result.status_id,
                stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : null,
                stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : null,
                compileOutput: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : null,
                executionTime: result.time,
                memoryUsed: result.memory
            };

            // Check if processing is complete
            if (result.status_id <= 2) {
                return { ...decoded, isProcessing: true };
            }

            // Determine if correct
            const isCorrect = result.status_id === judge0Config.statuses.ACCEPTED;

            // Update submission in database
            const submission = await submissionRepository.findByToken(token);
            if (submission) {
                await submissionRepository.update(submission.id, {
                    status: result.status.description,
                    stdout: decoded.stdout,
                    stderr: decoded.stderr,
                    compileOutput: decoded.compileOutput,
                    executionTime: decoded.executionTime,
                    memoryUsed: decoded.memoryUsed,
                    isCorrect
                });

                // If correct, complete the level
                if (isCorrect && userId) {
                    const challenge = await challengeRepository.findById(submission.challenge_id);
                    const completionResult = await progressService.completeLevel(userId, challenge.level_id);
                    decoded.levelCompleted = !completionResult.alreadyCompleted;
                    decoded.xpAwarded = completionResult.xpAwarded;
                    decoded.newTotalXp = completionResult.newTotalXp;
                    decoded.nextLevelId = completionResult.nextLevelId;
                }
            }

            return { ...decoded, isProcessing: false, isCorrect };
        } catch (error) {
            console.error('Judge0 result error:', error.response?.data || error.message);
            throw ApiError.internal('Failed to get submission result');
        }
    }

    async getLanguages() {
        try {
            const response = await this.client.get('/languages');
            return response.data;
        } catch (error) {
            console.error('Judge0 languages error:', error.message);
            return Object.entries(judge0Config.languages).map(([name, id]) => ({ id, name }));
        }
    }
}

module.exports = new Judge0Service();
