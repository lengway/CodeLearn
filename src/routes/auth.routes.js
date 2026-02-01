const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/register',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    validate,
    authController.register
);

router.post('/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    validate,
    authController.login
);

router.get('/me', auth, authController.me);

module.exports = router;
