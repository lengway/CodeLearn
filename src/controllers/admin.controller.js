const adminRepository = require('../repositories/admin.repository');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// ============ DASHBOARD ============

const getDashboard = catchAsync(async (req, res) => {
    const stats = await adminRepository.getStats();
    const recentSubmissions = await adminRepository.getRecentSubmissions(10);
    
    res.json({
        success: true,
        data: { stats, recentSubmissions }
    });
});

// ============ COURSES ============

const getCourses = catchAsync(async (req, res) => {
    const courses = await adminRepository.getAllCourses();
    res.json({ success: true, data: courses });
});

const getCourse = catchAsync(async (req, res) => {
    const course = await adminRepository.getCourseById(req.params.id);
    if (!course) {
        throw ApiError.notFound('Course not found');
    }
    
    const levels = await adminRepository.getLevelsByCourse(req.params.id);
    res.json({ success: true, data: { ...course, levels } });
});

const createCourse = catchAsync(async (req, res) => {
    const { title, description, language, difficulty, image_url, is_published } = req.body;
    
    if (!title || !language) {
        throw ApiError.badRequest('Title and language are required');
    }
    
    const course = await adminRepository.createCourse({
        title, description, language, difficulty, image_url, is_published
    });
    
    res.status(201).json({ success: true, data: course });
});

const updateCourse = catchAsync(async (req, res) => {
    const course = await adminRepository.updateCourse(req.params.id, req.body);
    if (!course) {
        throw ApiError.notFound('Course not found');
    }
    res.json({ success: true, data: course });
});

const deleteCourse = catchAsync(async (req, res) => {
    const result = await adminRepository.deleteCourse(req.params.id);
    if (!result) {
        throw ApiError.notFound('Course not found');
    }
    res.json({ success: true, message: 'Course deleted successfully' });
});

// ============ LEVELS ============

const getLevels = catchAsync(async (req, res) => {
    const levels = await adminRepository.getLevelsByCourse(req.params.courseId);
    res.json({ success: true, data: levels });
});

const getLevel = catchAsync(async (req, res) => {
    const level = await adminRepository.getLevelById(req.params.id);
    if (!level) {
        throw ApiError.notFound('Level not found');
    }
    res.json({ success: true, data: level });
});

const createLevel = catchAsync(async (req, res) => {
    const { course_id, title, theory_content, xp_reward, order_index } = req.body;
    
    if (!course_id || !title) {
        throw ApiError.badRequest('Course ID and title are required');
    }
    
    const level = await adminRepository.createLevel({
        course_id, title, theory_content, xp_reward, order_index
    });
    
    res.status(201).json({ success: true, data: level });
});

const updateLevel = catchAsync(async (req, res) => {
    const level = await adminRepository.updateLevel(req.params.id, req.body);
    if (!level) {
        throw ApiError.notFound('Level not found');
    }
    res.json({ success: true, data: level });
});

const deleteLevel = catchAsync(async (req, res) => {
    const result = await adminRepository.deleteLevel(req.params.id);
    if (!result) {
        throw ApiError.notFound('Level not found');
    }
    res.json({ success: true, message: 'Level deleted successfully' });
});

const reorderLevels = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { levels } = req.body; // [{ id, order_index }, ...]
    
    if (!levels || !Array.isArray(levels)) {
        throw ApiError.badRequest('Levels array is required');
    }
    
    await adminRepository.reorderLevels(courseId, levels);
    res.json({ success: true, message: 'Levels reordered successfully' });
});

// ============ CHALLENGES ============

const getChallenge = catchAsync(async (req, res) => {
    const challenge = await adminRepository.getChallengeByLevelId(req.params.levelId);
    res.json({ success: true, data: challenge || null });
});

const upsertChallenge = catchAsync(async (req, res) => {
    const { levelId } = req.params;
    const { description, starter_code, language_id, expected_output, test_input, time_limit, memory_limit } = req.body;
    
    if (!description || !language_id || expected_output === undefined) {
        throw ApiError.badRequest('Description, language_id and expected_output are required');
    }
    
    const challenge = await adminRepository.upsertChallenge(levelId, {
        description, starter_code, language_id, expected_output, test_input, time_limit, memory_limit
    });
    
    res.json({ success: true, data: challenge });
});

const deleteChallenge = catchAsync(async (req, res) => {
    const result = await adminRepository.deleteChallenge(req.params.id);
    if (!result) {
        throw ApiError.notFound('Challenge not found');
    }
    res.json({ success: true, message: 'Challenge deleted successfully' });
});

// ============ USERS ============

const getUsers = catchAsync(async (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const users = await adminRepository.getAllUsers(limit, offset);
    res.json({ success: true, data: users });
});

const updateUserRole = catchAsync(async (req, res) => {
    const { role } = req.body;
    
    if (!role || !['user', 'admin'].includes(role)) {
        throw ApiError.badRequest('Valid role is required (user or admin)');
    }
    
    const user = await adminRepository.updateUserRole(req.params.id, role);
    if (!user) {
        throw ApiError.notFound('User not found');
    }
    
    res.json({ success: true, data: user });
});

module.exports = {
    getDashboard,
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getLevels,
    getLevel,
    createLevel,
    updateLevel,
    deleteLevel,
    reorderLevels,
    getChallenge,
    upsertChallenge,
    deleteChallenge,
    getUsers,
    updateUserRole
};
