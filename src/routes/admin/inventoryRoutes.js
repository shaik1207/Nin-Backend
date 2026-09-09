const express = require('express');
const router = express.Router();
const inventoryController = require('../../controllers/admin/inventoryController');

router.get('/', inventoryController.getInventory);
router.put('/:menuItemId', inventoryController.updateStock);

module.exports = router;