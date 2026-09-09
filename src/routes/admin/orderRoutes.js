const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/orderController');

// GET /api/admin/orders -> Fetch all orders across all users
router.get('/', orderController.getAllOrders);

// GET /api/admin/orders/:id -> Fetch a single order by ID
router.get('/:id', orderController.getOrderById);

// PUT /api/admin/orders/:id/status -> Admin updates order status
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;