const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
    const { email, username, password } = req.body;
    
    const { user, token } = await authService.register(email, username, password);
    
    res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: { user, token }
    });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    
    const { user, token } = await authService.login(email, password);
    
    res.json({
        success: true,
        message: 'Login successful',
        data: { user, token }
    });
});

const me = catchAsync(async (req, res) => {
    const userService = require('../services/user.service');
    const profile = await userService.getProfile(req.user.id);
    
    res.json({
        success: true,
        data: profile
    });
});

module.exports = { register, login, me };
