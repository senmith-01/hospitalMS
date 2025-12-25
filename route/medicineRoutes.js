const express = require('express');
const router = express.Router();
const medicineController = require('../controller/medicineController');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');

// Some routes might be accessible by pharmacist only, but we use 'auth' general for now
// Delete/Create could be restricted to admin or pharmacist role if desired.
// For now, let's keep it simple with 'auth' and maybe 'admin' for delete.

router.post('/', auth, medicineController.createMedicine);
router.get('/', auth, medicineController.getAllMedicines);
router.get('/:id', auth, medicineController.getMedicineById);
router.put('/:id', auth, medicineController.updateMedicine);
router.delete('/:id', auth, admin, medicineController.deleteMedicine);

module.exports = router;
