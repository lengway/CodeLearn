const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
    let error = err;
    
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }
    
    // If not an ApiError, convert it
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, false);
    }
    
    const response = {
        success: false,
        status: error.status,
        message: error.message
    };
    
    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }
    
    res.status(error.statusCode).json(response);
};

const notFound = (req, res, next) => {
    next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};

module.exports = { errorHandler, notFound };
