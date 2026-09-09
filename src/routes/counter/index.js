const express = require('express');
const router = express.Router();

const safeImport = (filePath) => {
  try { return require(filePath); } 
  catch (err) { return null; }
};

const authRoutes = safeImport('./authRoutes');
const statusRoutes = safeImport('./statusRoutes');
const orderRoutes = safeImport('./orderRoutes'); // ✅ Added Order Routes for Counter

if (authRoutes) router.use('/auth', authRoutes);
if (statusRoutes) router.use('/status', statusRoutes);
if (orderRoutes) router.use('/orders', orderRoutes); // ✅ Mounts /api/counter/orders

module.exports = router;