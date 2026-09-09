const express = require('express');
const router = express.Router();
const counterController = require('../../controllers/admin/counterController');

router.get('/', counterController.getCounters);
router.post('/', counterController.createCounter);
router.put('/:id/status', counterController.updateStatus);
router.put('/:id/password', counterController.updatePassword);
router.delete('/:id', counterController.deleteCounter);
router.get('/:id/report', counterController.getCounterReport);

module.exports = router;