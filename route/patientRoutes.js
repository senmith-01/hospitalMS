const express = require('express');
const router = express.Router();
const patientController = require('../controller/patientController');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');

// All routes are protected by auth
router.post('/', auth, patientController.createPatient);
router.get('/', auth, patientController.getAllPatients);
router.get('/:id', auth, patientController.getPatientById);
router.put('/:id', auth, patientController.updatePatient);
router.delete('/:id', auth, admin, patientController.deletePatient); // Admin only

module.exports = router;
