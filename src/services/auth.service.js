const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const userRepository = require('../repositories/user.repository');
const progressRepository = require('../repositories/progress.repository');
const levelRepository = require('../repositories/level.repository');
const ApiError = require('../utils/ApiError');

class AuthService {
    async register(email, username, password) {
        // Check if user exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw ApiError.conflict('Email already registered');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const user = await userRepository.create({
            email,
            username,
            passwordHash
        });

        // Generate token
        const token = this.generateToken(user);

        return { user, token };
    }

    async login(email, password) {
        // Find user
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        // Generate token
        const token = this.generateToken(user);

        // Remove password from response
        const { password_hash, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }

    generateToken(user) {
        return jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                username: user.username 
            },
            jwtConfig.secret,
            { 
                expiresIn: jwtConfig.expiresIn,
                algorithm: jwtConfig.algorithm
            }
        );
    }

    async initializeUserProgress(userId, courseId) {
        // Get first level of the course
        const levels = await levelRepository.findByCourseId(courseId);
        
        if (levels.length > 0) {
            // Make first level available
            await progressRepository.create(userId, levels[0].id, 'available');
        }
    }
}

module.exports = new AuthService();
