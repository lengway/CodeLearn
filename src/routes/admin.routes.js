const express = require('express');
const adminController = require('../controllers/admin.controller');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require auth + admin
router.use(auth, requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Courses CRUD
router.get('/courses', adminController.getCourses);
router.get('/courses/:id', adminController.getCourse);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

// Levels CRUD
router.get('/courses/:courseId/levels', adminController.getLevels);
router.post('/levels', adminController.createLevel);
router.get('/levels/:id', adminController.getLevel);
router.put('/levels/:id', adminController.updateLevel);
router.delete('/levels/:id', adminController.deleteLevel);
router.put('/courses/:courseId/levels/reorder', adminController.reorderLevels);

// Challenges CRUD
router.get('/levels/:levelId/challenge', adminController.getChallenge);
router.put('/levels/:levelId/challenge', adminController.upsertChallenge);
router.delete('/challenges/:id', adminController.deleteChallenge);

// Users management
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);

module.exports = router;
