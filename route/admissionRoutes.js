const express = require('express');
const router = express.Router();
const admissionController = require('../controller/admissionController');
const auth = require('../middleware/auth');

router.post('/', auth, admissionController.admitPatient);
router.get('/', auth, admissionController.getAllAdmissions);
router.get('/:id', auth, admissionController.getAdmissionById);
router.put('/:id', auth, admissionController.updateAdmission);
router.delete('/:id', auth, admissionController.deleteAdmission);

module.exports = router;
