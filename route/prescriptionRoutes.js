const express = require('express');
const router = express.Router();
const prescriptionController = require('../controller/prescriptionController');
const auth = require('../middleware/auth');

router.post('/', auth, prescriptionController.createPrescription);
router.get('/', auth, prescriptionController.getAllPrescriptions);
router.get('/:id', auth, prescriptionController.getPrescriptionById);
router.put('/:id', auth, prescriptionController.updatePrescription);
router.delete('/:id', auth, prescriptionController.deletePrescription);

module.exports = router;
