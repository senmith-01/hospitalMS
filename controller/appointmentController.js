const Appointment = require('../model/Appointment');

// Create Appointment
exports.createAppointment = async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Appointments (Filter by Doctor or Patient)
exports.getAllAppointments = async (req, res) => {
    try {
        let query = {};
        if (req.query.doctorId) query.doctor = req.query.doctorId;
        if (req.query.patientId) query.patient = req.query.patientId;
        if (req.query.date) {
            const date = new Date(req.query.date);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            query.date = { $gte: date, $lt: nextDay };
        }

        const appointments = await Appointment.find(query)
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'name specialization')
            .sort({ date: 1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'name specialization');

        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Appointment not found' });
        res.status(500).send('Server Error');
    }
};

// Update Appointment
exports.updateAppointment = async (req, res) => {
    try {
        let appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Appointment
exports.deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Appointment removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
