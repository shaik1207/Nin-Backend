const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authController');

// ==========================================
// 0. TEST ROUTE
// ==========================================
router.get('/test', (req, res) => {
  res.status(200).json({ success: true, message: 'Auth Routes Working' });
});

// ==========================================
// 1. USER ENDPOINTS (Public App)
// ==========================================
router.post('/user/register', authController.userRegister);
router.post('/user/login', authController.userLogin);
router.post('/user/google', authController.googleLogin);

// ==========================================
// 2. ADMIN ENDPOINTS (Web Dashboard)
// ==========================================
// ✅ FIXED: Missing endpoint mapped correctly
router.post('/admin/register', authController.adminRegister);
router.post('/admin/login', authController.adminLogin);

// ==========================================
// 3. COUNTER ENDPOINTS (POS Terminal)
// ==========================================
router.post('/counter/login', authController.counterLogin);

module.exports = router;