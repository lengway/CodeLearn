const express = require('express');
const coursesController = require('../controllers/courses.controller');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all courses (public)
router.get('/', coursesController.getAllCourses);

// Get course by id with levels (auth optional - shows progress if logged in)
router.get('/:id', optionalAuth, coursesController.getCourseById);

// Start a course (initialize progress)
router.post('/:id/start', auth, coursesController.startCourse);

module.exports = router;
