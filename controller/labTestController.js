const LabTest = require('../model/LabTest');

// Create Lab Test
exports.createLabTest = async (req, res) => {
    try {
        const newTest = new LabTest(req.body);
        const test = await newTest.save();
        res.json(test);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Lab Tests (Filter)
exports.getAllLabTests = async (req, res) => {
    try {
        let query = {};
        if (req.query.patientId) query.patient = req.query.patientId;
        if (req.query.status) query.status = req.query.status;

        const tests = await LabTest.find(query)
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'name specialization')
            .populate('assignedTechnician', 'name');
        res.json(tests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Lab Test by ID
exports.getLabTestById = async (req, res) => {
    try {
        const test = await LabTest.findById(req.params.id)
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'name specialization')
            .populate('assignedTechnician', 'name');

        if (!test) return res.status(404).json({ msg: 'Lab test not found' });
        res.json(test);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Lab test not found' });
        res.status(500).send('Server Error');
    }
};

// Update Lab Test (Status, Report File, etc.)
exports.updateLabTest = async (req, res) => {
    try {
        // If status is updated to completed, maybe set updatedDate automatically
        if (req.body.status === 'completed' && !req.body.updatedDate) {
            req.body.updatedDate = Date.now();
        }

        let test = await LabTest.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(test);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Lab Test
exports.deleteLabTest = async (req, res) => {
    try {
        await LabTest.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Lab test removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
