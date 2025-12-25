const Admission = require('../model/Admission');

// Admit Patient
exports.admitPatient = async (req, res) => {
    try {
        const newAdmission = new Admission(req.body);
        const admission = await newAdmission.save();
        res.json(admission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Admissions (Filter by discharged or current)
exports.getAllAdmissions = async (req, res) => {
    try {
        let query = {};
        if (req.query.patientId) query.patient = req.query.patientId;
        if (req.query.active === 'true') query.dischargeDate = { $exists: false }; // Current admissions

        const admissions = await Admission.find(query)
            .populate('patient', 'firstName lastName')
            .sort({ admissionDate: -1 });
        res.json(admissions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Admission by ID
exports.getAdmissionById = async (req, res) => {
    try {
        const admission = await Admission.findById(req.params.id)
            .populate('patient', 'firstName lastName');

        if (!admission) return res.status(404).json({ msg: 'Admission not found' });
        res.json(admission);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Admission not found' });
        res.status(500).send('Server Error');
    }
};

// Update Admission (Discharge, Update Ward, Add Note)
exports.updateAdmission = async (req, res) => {
    try {
        let admission = await Admission.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(admission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Admission
exports.deleteAdmission = async (req, res) => {
    try {
        await Admission.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Admission record removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
