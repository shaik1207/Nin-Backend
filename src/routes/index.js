const express = require('express');
const router = express.Router();

console.log('✅ Loading API Routes');

const orderRoutes = require('./user/orderRoutes');
const publicMenuRoutes = require('./user/menuRoutes');
const authRoutes = require('./user/authRoutes');
const adminRoutes = require('./admin');
const counterRoutes = require('./counter');

console.log('✅ Auth Routes Loaded');

router.use('/orders', orderRoutes);
router.use('/menu', publicMenuRoutes);
router.use('/auth', authRoutes);

router.use('/admin', adminRoutes);

if (counterRoutes) {
  router.use('/counter', counterRoutes);
}

router.use((req, res) => {
  console.error(
    `❌ 404: Client requested [${req.method}] ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.originalUrl}`
  });
});

module.exports = router;