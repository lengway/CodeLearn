const codeExecutionService = require('../services/codeExecution.service');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const submitCode = catchAsync(async (req, res) => {
    const { challengeId, code, languageId } = req.body;
    const userId = req.user.id;
    
    if (!code || !code.trim()) {
        throw ApiError.badRequest('Code is required');
    }
    
    const result = await codeExecutionService.submitCode(userId, challengeId, code, languageId);
    
    // Piston returns result immediately
    res.status(200).json({
        success: true,
        message: 'Code executed',
        data: {
            token: result.token,
            levelId: result.levelId,
            ...result.result
        }
    });
});

const getSubmissionResult = catchAsync(async (req, res) => {
    const { token } = req.params;
    const userId = req.user.id;
    
    const result = await codeExecutionService.getSubmissionResult(token, userId);
    
    res.json({
        success: true,
        data: result
    });
});

const getLanguages = catchAsync(async (req, res) => {
    const languages = await codeExecutionService.getLanguages();
    
    res.json({
        success: true,
        data: languages
    });
});

module.exports = { submitCode, getSubmissionResult, getLanguages };
