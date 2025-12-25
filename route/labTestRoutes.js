const express = require('express');
const router = express.Router();
const labTestController = require('../controller/labTestController');
const auth = require('../middleware/auth');

router.post('/', auth, labTestController.createLabTest);
router.get('/', auth, labTestController.getAllLabTests);
router.get('/:id', auth, labTestController.getLabTestById);
router.put('/:id', auth, labTestController.updateLabTest);
router.delete('/:id', auth, labTestController.deleteLabTest);

module.exports = router;
