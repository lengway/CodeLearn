const courseService = require('../services/course.service');
const progressService = require('../services/progress.service');
const catchAsync = require('../utils/catchAsync');

const getAllCourses = catchAsync(async (req, res) => {
    const courses = await courseService.getAllCourses();
    
    res.json({
        success: true,
        data: courses
    });
});

const getCourseById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    
    let course;
    if (userId) {
        course = await courseService.getCourseWithProgress(id, userId);
    } else {
        course = await courseService.getCourseWithLevels(id);
    }
    
    res.json({
        success: true,
        data: course
    });
});

const startCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    await progressService.initializeCourseProgress(userId, id);
    const course = await courseService.getCourseWithProgress(id, userId);
    
    res.json({
        success: true,
        message: 'Course started',
        data: course
    });
});

module.exports = { getAllCourses, getCourseById, startCourse };
