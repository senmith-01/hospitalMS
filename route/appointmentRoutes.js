const express = require('express');
const router = express.Router();
const appointmentController = require('../controller/appointmentController');
const auth = require('../middleware/auth');

// Protected routes
router.post('/', auth, appointmentController.createAppointment);
router.get('/', auth, appointmentController.getAllAppointments);
router.get('/:id', auth, appointmentController.getAppointmentById);
router.put('/:id', auth, appointmentController.updateAppointment);
router.delete('/:id', auth, appointmentController.deleteAppointment);

module.exports = router;
