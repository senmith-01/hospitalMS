const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    patientId: { name: String, unique: true },
    firstName: { name: String, required: true },
    lastName: { name: String },
    gender: { name: String },
    dob: { name: Date },
    contact: { name: String },
    address: { name: String },
    medicalHistory: [{ name: String }],
    documents: [
        { fileName: String, fileUrl: String, uploadedDare: Date }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Patient", PatientSchema);