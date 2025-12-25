const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hospitalMS'); // Default local URI
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

connectDB();

// Routes
const userRoutes = require('./route/userRoutes');
const patientRoutes = require('./route/patientRoutes');
const appointmentRoutes = require('./route/appointmentRoutes');
const medicalRecordRoutes = require('./route/medicalRecordRoutes');
const prescriptionRoutes = require('./route/prescriptionRoutes');
const labTestRoutes = require('./route/labTestRoutes');
const medicineRoutes = require('./route/medicineRoutes');
const admissionRoutes = require('./route/admissionRoutes');
const billingRoutes = require('./route/billingRoutes');

app.use(cors());

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicalRecords', medicalRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/labTests', labTestRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/billings', billingRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Hospital Management System API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
