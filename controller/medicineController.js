const Medicine = require('../model/medicine');

// Create Medicine
exports.createMedicine = async (req, res) => {
    try {
        const newMedicine = new Medicine(req.body);
        const medicine = await newMedicine.save();
        res.json(medicine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Medicines
exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ name: 1 });
        res.json(medicines);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Medicine by ID
exports.getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) return res.status(404).json({ msg: 'Medicine not found' });
        res.json(medicine);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Medicine not found' });
        res.status(500).send('Server Error');
    }
};

// Update Medicine (Stock, Price, etc.)
exports.updateMedicine = async (req, res) => {
    try {
        let medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(medicine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Medicine
exports.deleteMedicine = async (req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Medicine removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
