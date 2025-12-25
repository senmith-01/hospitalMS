const Billing = require('../model/Billing');

// Create Bill
exports.createBill = async (req, res) => {
    try {
        const newBill = new Billing(req.body);
        const bill = await newBill.save();
        res.json(bill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Bills (Filter by patient or status)
exports.getAllBills = async (req, res) => {
    try {
        let query = {};
        if (req.query.patientId) query.patient = req.query.patientId;
        if (req.query.status) query.paymentStatus = req.query.status;

        const bills = await Billing.find(query)
            .populate('patient', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(bills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Bill by ID
exports.getBillById = async (req, res) => {
    try {
        const bill = await Billing.findById(req.params.id)
            .populate('patient', 'firstName lastName');

        if (!bill) return res.status(404).json({ msg: 'Bill not found' });
        res.json(bill);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Bill not found' });
        res.status(500).send('Server Error');
    }
};

// Update Bill (Payment Status, Paid Amount)
exports.updateBill = async (req, res) => {
    try {
        let bill = await Billing.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(bill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Bill
exports.deleteBill = async (req, res) => {
    try {
        await Billing.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Bill removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
