const express = require('express');
const router = express.Router();
// const authController = require('../../controllers/auth/authController');
const authController = require('../controllers/auth/authController');

// User Frontend Endpoints (Public)
router.post('/user/register', authController.userRegister);
router.post('/user/login', authController.userLogin);
router.post('/user/google', authController.googleLogin);

// Admin Frontend Endpoints (Requires Admin Role)
router.post('/admin/login', authController.adminLogin);

// Counter Frontend Endpoints (Requires Counter Table Match)
router.post('/counter/login', authController.counterLogin);

module.exports = router;