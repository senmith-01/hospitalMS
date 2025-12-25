const express = require('express');
const router = express.Router();
const billingController = require('../controller/billingController');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');

router.post('/', auth, billingController.createBill);
router.get('/', auth, billingController.getAllBills);
router.get('/:id', auth, billingController.getBillById);
router.put('/:id', auth, billingController.updateBill);
router.delete('/:id', auth, admin, billingController.deleteBill); // Admin only?

module.exports = router;
