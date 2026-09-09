const express = require('express');
const router = express.Router();
const menuController = require('../../controllers/admin/menuController');
const upload = require('../../middlewares/uploadMiddleware');

// Get all menu items
router.get('/', menuController.getMenu);

// Create a new menu item (with image upload)
router.post('/', upload.single('image'), menuController.createMenuItem);

// Update a menu item (with optional new image upload)
router.put('/:id', upload.single('image'), menuController.updateMenuItem);

// Update ONLY the status (Available/Unavailable)
router.put('/:id/status', menuController.updateStatus);

// Delete a menu item
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;