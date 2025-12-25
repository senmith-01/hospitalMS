const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema =
    new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        phone: { type: String },
        role: {
            type: String,
            enum: ["admin", "doctor", "nurse", "lab", "pharmacist", "receptionist"],
            required: true
        },
        password: { type: String, required: true },
        profileImage: { type: String },
        resetToken: { type: String },
        resetTokenExpiry: { type: Date },

        specialization: { type: String },
        Qualifications: { type: String },
        experience: { type: Number },

        availability: [
            { day: String, startTime: String, endTime: String }
        ]

    }, { timestamps: true });

// Generate Password Reset Token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

module.exports = mongoose.model("User", UserSchema);