const express = require('express');
const levelsController = require('../controllers/levels.controller');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get level with challenge (requires auth to track progress)
router.get('/:id', auth, levelsController.getLevelById);

module.exports = router;
