const User = require('../model/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, phone, role, password, specialization, Qualifications, experience, availability } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Validate password
        if (!password || password.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name,
            email,
            phone,
            role,
            password: hashedPassword,
            specialization,
            Qualifications,
            experience,
            availability
        });

        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create JWT Token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secretKey', // Use environment variable
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Users (Admin/Receptionist might need this, or for searching doctors)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get User by ID (Profile)
exports.getUserProfile = async (req, res) => {
    try {
        // Assuming auth middleware adds req.user
        // If getting own profile: req.user.id
        // If getting another user (e.g. patients viewing doctors): req.params.id

        const userId = req.params.id || req.user.id;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        // Assuming auth middleware ensures user can only update their own profile or admin updates
        const userId = req.params.id;

        // Build update object
        // For simplicity, we can use req.body directly, but usually we filter fields
        // Note: Password update should be handled separately to hash it again if changed

        const { name, phone, specialization, Qualifications, experience, availability } = req.body;
        const updateFields = {};
        if (name) updateFields.name = name;
        if (phone) updateFields.phone = phone;
        if (specialization) updateFields.specialization = specialization;
        if (Qualifications) updateFields.Qualifications = Qualifications;
        if (experience) updateFields.experience = experience;
        if (availability) updateFields.availability = availability;

        // Find and update
        let user = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true } // Return updated document
        ).select('-password');

        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// Get Current User (Me)
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset URL
        // In production, this should be the frontend URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(err);
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ msg: 'Email could not be sent' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    // Get hashed token
    const resetToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    try {
        const user = await User.findOne({
            resetToken,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Token' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        // Log user in directly? Or ask to login again?
        // Let's just return success
        res.status(200).json({ success: true, data: 'Password updated successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Change Password (Logged in user)
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid current password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, data: 'Password updated' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update User Availability (Doctor)
exports.updateAvailability = async (req, res) => {
    try {
        // Can be done by admin or the doctor themselves
        const userId = req.params.id || req.user.id;

        // If trying to update another user's availability and not admin
        if (req.params.id && req.params.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized to update this user' });
        }

        const { availability } = req.body; // Expecting array of objects

        const user = await User.findByIdAndUpdate(userId, { availability }, { new: true });

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update User Role (Admin only)
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
