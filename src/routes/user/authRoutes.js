const express = require('express');
const router = express.Router();
const authController = require('../../controllers/user/authController');

// POST /api/auth/user/register
router.post('/user/register', authController.registerUser);

// POST /api/auth/user/login
router.post('/user/login', authController.loginUser);

// POST /api/auth/user/google
router.post('/user/google', authController.googleAuth);

module.exports = router;