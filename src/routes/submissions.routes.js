const express = require('express');
const { body } = require('express-validator');
const submissionsController = require('../controllers/submissions.controller');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Submit code for evaluation
router.post('/',
    auth,
    [
        body('challengeId').isUUID().withMessage('Valid challenge ID is required'),
        body('code').notEmpty().withMessage('Code is required')
    ],
    validate,
    submissionsController.submitCode
);

// Get submission result
router.get('/:token', auth, submissionsController.getSubmissionResult);

// Get available languages
router.get('/languages/list', submissionsController.getLanguages);

module.exports = router;
