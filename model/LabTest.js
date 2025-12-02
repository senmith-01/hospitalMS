const mongoose = require('mongoose');

const LabTestSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    testName: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "sample_collected", "processing", "completed"],
        default: "pending"
    },
    assignedTechnician: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportFile: { String },
    updatedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("LabTest", LabTestSchema); 