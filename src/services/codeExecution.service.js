const axios = require('axios');
const pistonConfig = require('../config/piston');
const challengeRepository = require('../repositories/challenge.repository');
const submissionRepository = require('../repositories/submission.repository');
const progressService = require('./progress.service');
const levelRepository = require('../repositories/level.repository');
const ApiError = require('../utils/ApiError');

class CodeExecutionService {
    constructor() {
        this.apiUrl = pistonConfig.apiUrl;
        this.client = axios.create({
            baseURL: this.apiUrl,
            timeout: 30000
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

        const langConfig = pistonConfig.languages[languageId || challenge.language_id];
        if (!langConfig) {
            throw ApiError.badRequest('Unsupported language');
        }

        try {
            // Build execute request
            const executeRequest = {
                language: langConfig.language,
                version: langConfig.version,
                files: [{ 
                    name: langConfig.filename,
                    content: sourceCode 
                }],
                stdin: challenge.test_input || '',
                compile_timeout: pistonConfig.limits.compileTimeout,
                run_timeout: pistonConfig.limits.runTimeout,
                compile_memory_limit: pistonConfig.limits.compileMemory,
                run_memory_limit: pistonConfig.limits.runMemory
            };

            // Execute code via Piston
            const response = await this.client.post('/api/v2/execute', executeRequest);

            const result = response.data;
            
            // Get output (compile error or run output)
            const stdout = result.run?.stdout?.trim() || '';
            const stderr = result.run?.stderr || result.compile?.stderr || '';
            const compileOutput = result.compile?.output || '';
            
            // Check if correct
            const expectedOutput = challenge.expected_output.trim();
            const isCorrect = stdout === expectedOutput && !stderr && !result.compile?.code;

            // Determine status
            let status = 'Accepted';
            if (result.compile?.code) {
                status = 'Compilation Error';
            } else if (stderr) {
                status = 'Runtime Error';
            } else if (!isCorrect) {
                status = 'Wrong Answer';
            }

            // Generate token for tracking
            const token = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Save submission
            await submissionRepository.create({
                userId,
                challengeId,
                code: sourceCode,
                languageId: languageId || challenge.language_id,
                judge0Token: token,
                status,
                stdout,
                stderr,
                compileOutput,
                executionTime: null,
                memoryUsed: null,
                isCorrect
            });

            // If correct, complete the level
            let completionResult = null;
            if (isCorrect) {
                completionResult = await progressService.completeLevel(userId, level.id);
            }

            return {
                token,
                levelId: level.id,
                // Return result immediately (Piston is synchronous)
                result: {
                    isProcessing: false,
                    isCorrect,
                    status: { description: status },
                    stdout,
                    stderr,
                    compileOutput,
                    levelCompleted: completionResult ? !completionResult.alreadyCompleted : false,
                    xpAwarded: completionResult?.xpAwarded || 0,
                    newTotalXp: completionResult?.newTotalXp,
                    nextLevelId: completionResult?.nextLevelId
                }
            };
        } catch (error) {
            console.error('Piston execution error:', error.response?.data || error.message);
            throw ApiError.internal('Failed to execute code: ' + (error.response?.data?.message || error.message));
        }
    }

    async getSubmissionResult(token, userId) {
        // With Piston, results are returned immediately
        // This method is for compatibility - just return from DB
        const submission = await submissionRepository.findByToken(token);
        
        if (!submission) {
            throw ApiError.notFound('Submission not found');
        }

        return {
            token: submission.judge0_token,
            isProcessing: false,
            isCorrect: submission.is_correct,
            status: { description: submission.status },
            stdout: submission.stdout,
            stderr: submission.stderr,
            compileOutput: submission.compile_output,
            executionTime: submission.execution_time,
            memoryUsed: submission.memory_used
        };
    }

    async getLanguages() {
        try {
            const response = await this.client.get('/api/v2/runtimes');
            return response.data.map(r => ({
                id: Object.entries(pistonConfig.languages).find(([_, v]) => v.language === r.language)?.[0] || r.language,
                name: `${r.language} (${r.version})`
            }));
        } catch (error) {
            // Return default list from config
            return Object.entries(pistonConfig.languages).map(([id, lang]) => ({
                id: parseInt(id),
                name: `${lang.language} (${lang.version})`
            }));
        }
    }

    async installLanguage(language, version) {
        try {
            await this.client.post('/api/v2/packages', { language, version });
            return true;
        } catch (error) {
            console.error('Failed to install language:', error.message);
            return false;
        }
    }
}

module.exports = new CodeExecutionService();
