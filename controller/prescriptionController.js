const Prescription = require('../model/Prescription');

// Create Prescription
exports.createPrescription = async (req, res) => {
    try {
        const newPrescription = new Prescription(req.body);
        const prescription = await newPrescription.save();
        res.json(prescription);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Prescriptions (Filter)
exports.getAllPrescriptions = async (req, res) => {
    try {
        let query = {};
        if (req.query.patientId) query.patient = req.query.patientId;
        if (req.query.doctorId) query.doctor = req.query.doctorId;

        const prescriptions = await Prescription.find(query)
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'name specialization')
            .populate('medicines.medicine', 'name'); // Populate medicine names
        res.json(prescriptions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Prescription by ID
exports.getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'name specialization')
            .populate('medicines.medicine', 'name');

        if (!prescription) return res.status(404).json({ msg: 'Prescription not found' });
        res.json(prescription);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Prescription not found' });
        res.status(500).send('Server Error');
    }
};

// Update Prescription
exports.updatePrescription = async (req, res) => {
    try {
        let prescription = await Prescription.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(prescription);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Prescription
exports.deletePrescription = async (req, res) => {
    try {
        await Prescription.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Prescription removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
