const courseRepository = require('../repositories/course.repository');
const levelRepository = require('../repositories/level.repository');
const progressRepository = require('../repositories/progress.repository');
const ApiError = require('../utils/ApiError');

class CourseService {
    async getAllCourses() {
        return await courseRepository.findAll();
    }

    async getCourseById(courseId) {
        const course = await courseRepository.findById(courseId);
        if (!course) {
            throw ApiError.notFound('Course not found');
        }
        return course;
    }

    async getCourseWithLevels(courseId) {
        const course = await courseRepository.findByIdWithLevels(courseId);
        if (!course) {
            throw ApiError.notFound('Course not found');
        }
        return course;
    }

    async getCourseWithProgress(courseId, userId) {
        const course = await courseRepository.findByIdWithLevels(courseId);
        if (!course) {
            throw ApiError.notFound('Course not found');
        }

        // Get user progress for this course
        const progress = await progressRepository.findByUserAndCourse(userId, courseId);
        const progressMap = new Map(progress.map(p => [p.level_id, p]));

        // Merge progress with levels
        course.levels = course.levels.map((level, index) => {
            const levelProgress = progressMap.get(level.id);
            
            let status = 'locked';
            if (levelProgress) {
                status = levelProgress.status;
            } else if (index === 0) {
                // First level is always available
                status = 'available';
            }

            return {
                ...level,
                status,
                attempts: levelProgress?.attempts || 0,
                completed_at: levelProgress?.completed_at || null
            };
        });

        // Calculate course progress
        const completedCount = course.levels.filter(l => l.status === 'completed').length;
        course.progress = {
            completed: completedCount,
            total: course.levels.length,
            percentage: Math.round((completedCount / course.levels.length) * 100)
        };

        return course;
    }
}

module.exports = new CourseService();
