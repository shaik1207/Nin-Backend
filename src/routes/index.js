const express = require('express');
const router = express.Router();

const orderRoutes = require('./user/orderRoutes');
const publicMenuRoutes = require('./user/menuRoutes');
const authRoutes = require('./user/authRoutes'); // ✅ Required
const adminRoutes = require('./admin/index'); 
const counterRoutes = require('./counter/index'); 

// Public & Auth Routes
router.use('/orders', orderRoutes);
router.use('/menu', publicMenuRoutes);
router.use('/auth', authRoutes); // ✅ Maps directly to /api/auth/user/register and /api/auth/user/google

// Admin & Counter Routes
router.use('/admin', adminRoutes); 
if (counterRoutes) {
  router.use('/counter', counterRoutes);
}

// 404 Fallback Catch-all
router.use((req, res) => {
  console.error(`❌ 404: Client requested [${req.method}] ${req.originalUrl}, but it is not mounted.`);
  res.status(404).json({ success: false, message: `API Route Not Found: ${req.originalUrl}` });
});

module.exports = router;