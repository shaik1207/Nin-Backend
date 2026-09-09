const express = require('express');
const router = express.Router();

// Import the settings controller
const settingsController = require('../../controllers/admin/settingsController');

// GET /api/admin/settings -> Fetch the global settings/logo
router.get('/', settingsController.getSettings);

// PUT /api/admin/settings -> Update settings
router.put('/', settingsController.updateSettings);

module.exports = router;