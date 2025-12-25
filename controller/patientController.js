const Patient = require('../model/Patient');

// Create Patient
exports.createPatient = async (req, res) => {
    try {
        // Check if patient already exists (e.g., by unique ID if provided manually, or generated)
        const { patientId } = req.body;
        if (patientId) {
            let existingPatient = await Patient.findOne({ patientId });
            if (existingPatient) return res.status(400).json({ msg: 'Patient already exists with this ID' });
        }

        const newPatient = new Patient(req.body);
        const patient = await newPatient.save();
        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.json(patients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Patient by ID
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Patient not found' });
        res.status(500).send('Server Error');
    }
};

// Update Patient
exports.updatePatient = async (req, res) => {
    try {
        let patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Patient
exports.deletePatient = async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Patient removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
