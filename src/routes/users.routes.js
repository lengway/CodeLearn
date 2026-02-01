const express = require('express');
const { body } = require('express-validator');
const usersController = require('../controllers/users.controller');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Get user profile
router.get('/profile', auth, usersController.getProfile);

// Update user profile
router.put('/profile', 
    auth,
    [
        body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
    ],
    validate,
    usersController.updateProfile
);

// Get user progress
router.get('/progress', auth, usersController.getProgress);

// Get leaderboard (public)
router.get('/leaderboard', usersController.getLeaderboard);

module.exports = router;
