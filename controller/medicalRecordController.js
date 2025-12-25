const MedicalRecord = require('../model/MedicalRecord');

// Create Medical Record
exports.createMedicalRecord = async (req, res) => {
    try {
        const newRecord = new MedicalRecord(req.body);
        const record = await newRecord.save();
        res.json(record);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Records (Filter)
exports.getAllMedicalRecords = async (req, res) => {
    try {
        let query = {};
        if (req.query.patientId) query.patient = req.query.patientId;
        if (req.query.doctorId) query.doctor = req.query.doctorId;

        const records = await MedicalRecord.find(query)
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'name specialization')
            .sort({ visitDate: -1 });
        res.json(records);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Record by ID
exports.getMedicalRecordById = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id)
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'name specialization');

        if (!record) return res.status(404).json({ msg: 'Medical record not found' });
        res.json(record);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Medical record not found' });
        res.status(500).send('Server Error');
    }
};

// Update Record
exports.updateMedicalRecord = async (req, res) => {
    try {
        let record = await MedicalRecord.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(record);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Record
exports.deleteMedicalRecord = async (req, res) => {
    try {
        await MedicalRecord.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Medical record removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
