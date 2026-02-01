const express = require('express');
const usersController = require('../controllers/users.controller');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, usersController.getProfile);

// Get user progress
router.get('/progress', auth, usersController.getProgress);

// Get leaderboard (public)
router.get('/leaderboard', usersController.getLeaderboard);

module.exports = router;
