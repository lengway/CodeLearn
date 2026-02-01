const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const ApiError = require('../utils/ApiError');

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('No token provided');
        }
        
        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(ApiError.unauthorized('Invalid token'));
        } else if (error.name === 'TokenExpiredError') {
            next(ApiError.unauthorized('Token expired'));
        } else {
            next(error);
        }
    }
};

const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, jwtConfig.secret);
            req.user = decoded;
        }
        
        next();
    } catch (error) {
        // Ignore errors for optional auth
        next();
    }
};

module.exports = { auth, optionalAuth };
