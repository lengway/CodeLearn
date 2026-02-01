const express = require('express');
const authRoutes = require('./auth.routes');
const coursesRoutes = require('./courses.routes');
const levelsRoutes = require('./levels.routes');
const submissionsRoutes = require('./submissions.routes');
const usersRoutes = require('./users.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);
router.use('/levels', levelsRoutes);
router.use('/submissions', submissionsRoutes);
router.use('/users', usersRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
