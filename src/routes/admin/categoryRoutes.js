const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categoryController');

router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.put('/:id/status', categoryController.updateStatus);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;