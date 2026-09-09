const express = require('express');
const router = express.Router();

const authController = require('../../controllers/counter/authController');

// POST /api/counter/auth/register
// Maps strictly to your custom registerCounterStaff function
router.post('/register', authController.registerCounterStaff);

// POST /api/counter/auth/login
// Maps strictly to your custom loginCounterStaff function
router.post('/login', authController.loginCounterStaff);

module.exports = router;