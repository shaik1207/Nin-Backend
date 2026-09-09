const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/counter/orderController');

// POST /api/counter/orders/scan -> Verifies a scanned order QR/Code
router.post('/scan', orderController.scanOrder);

// PUT /api/counter/orders/:id/status -> Updates order status at the counter
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;