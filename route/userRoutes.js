const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');


// @route   POST /api/users/register
// @desc    Register user
// @access  Public
router.post('/register', userController.register);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', userController.login);

// @route   GET /api/users/getAllUsers
// @desc    Get all users
// @access  Public (or Private if you uncomment auth)
// router.get('/getAllUsers', auth, userController.getAllUsers);
router.get('/getAllUsers', auth, admin, userController.getAllUsers);

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Private
// If no ID is provided, it could default to current user in controller if logic allows, 
// but here we define a route with param.
router.get('/profile/:id', auth, userController.getUserProfile);
router.get('/profile', auth, userController.getUserProfile); // For current user

// @route   PUT /api/users/profile/:id
// @desc    Update user profile
// @access  Private
router.put('/profile/:id', auth, userController.updateUserProfile);


// @route   POST /api/users/forgotPassword
// @desc    Forgot Password
// @access  Public
router.post('/forgotPassword', userController.forgotPassword);

// @route   PUT /api/users/resetPassword/:resetToken
// @desc    Reset Password
// @access  Public
router.put('/resetPassword/:resetToken', userController.resetPassword);

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, userController.getMe);

// @route   PUT /api/users/changePassword
// @desc    Change Password
// @access  Private
router.put('/changePassword', auth, userController.changePassword);

// @route   PUT /api/users/updateAvailability/:id
// @desc    Update Doctor Availability (or self)
// @access  Private
router.put('/updateAvailability/:id', auth, userController.updateAvailability);
router.put('/updateAvailability', auth, userController.updateAvailability); // For self

// @route   PUT /api/users/updateRole/:id
// @desc    Update User Role
// @access  Private (Admin only)
router.put('/updateRole/:id', auth, admin, userController.updateUserRole);

// @route   DELETE /api/users/:id
// @desc    Delete User
// @access  Private (Admin only)
router.delete('/:id', auth, admin, userController.deleteUser);


module.exports = router;
