const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
const pistonConfig = require('../config/piston');

const router = express.Router();

// Run code in playground (no auth required)
router.post('/run',
    [
        body('code').notEmpty().withMessage('Code is required'),
        body('languageId').isInt().withMessage('Language ID is required')
    ],
    validate,
    catchAsync(async (req, res) => {
        const { code, languageId, stdin } = req.body;

        const langConfig = pistonConfig.languages[languageId];
        if (!langConfig) {
            return res.status(400).json({
                success: false,
                error: 'Unsupported language'
            });
        }

        const client = axios.create({
            baseURL: pistonConfig.apiUrl,
            timeout: 30000
        });

        const executeRequest = {
            language: langConfig.language,
            version: langConfig.version,
            files: [{
                name: langConfig.filename,
                content: code
            }],
            stdin: stdin || '',
            compile_timeout: pistonConfig.limits.compileTimeout,
            run_timeout: pistonConfig.limits.runTimeout,
            compile_memory_limit: pistonConfig.limits.compileMemory,
            run_memory_limit: pistonConfig.limits.runMemory
        };

        try {
            const response = await client.post('/api/v2/execute', executeRequest);
            const result = response.data;

            const stdout = result.run?.stdout || '';
            const stderr = result.run?.stderr || result.compile?.stderr || '';
            const compileOutput = result.compile?.output || '';

            res.json({
                success: true,
                data: {
                    stdout,
                    stderr,
                    compileOutput,
                    language: langConfig.language,
                    version: langConfig.version
                }
            });
        } catch (error) {
            console.error('Playground execution error:', error.response?.data || error.message);
            res.status(500).json({
                success: false,
                error: 'Failed to execute code: ' + (error.response?.data?.message || error.message)
            });
        }
    })
);

module.exports = router;
