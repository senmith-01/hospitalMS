const mongoose = require('mongoose');

const models = [
    './model/User',
    './model/Patient',
    './model/Appointment',
    './model/MedicalRecord',
    './model/Prescription',
    './model/LabTest',
    './model/Medicine',
    './model/Admission',
    './model/Billing'
];

async function checkModels() {
    for (const modelPath of models) {
        try {
            console.log(`Checking ${modelPath}...`);
            require(modelPath);
            console.log(`✅ ${modelPath} loaded.`);
        } catch (err) {
            console.error(`❌ Error in ${modelPath}:`);
            console.error(err);
        }
    }
}

checkModels();
