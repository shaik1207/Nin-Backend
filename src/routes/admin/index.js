const express = require('express');
const router = express.Router();

const safeRequire = (filePath) => {
  try {
    return require(filePath);
  } catch (err) {
    console.warn(`⚠️ Optional Admin Route Missing: ${filePath}`);
    return null;
  }
};

const settingsRoutes = safeRequire('./settingsRoutes');
const orderRoutes = safeRequire('./orderRoutes'); 
const userRoutes = safeRequire('./userRoutes'); 
const categoryRoutes = safeRequire('./categoryRoutes'); 
const menuRoutes = safeRequire('./menuRoutes'); 
const counterRoutes = safeRequire('./counterRoutes'); 
const logRoutes = safeRequire('./logRoutes'); 

// 🚨 STRICT REQUIRE: This will show you if there's a syntax or controller crash inside reports
const reportsRoutes = require('./reportsRoutes'); 

if (settingsRoutes) router.use('/settings', settingsRoutes);
if (orderRoutes) router.use('/orders', orderRoutes);
if (userRoutes) router.use('/users', userRoutes); 
if (reportsRoutes) router.use('/reports', reportsRoutes); // ✅ Mounted explicitly
if (categoryRoutes) router.use('/categories', categoryRoutes); 
if (menuRoutes) router.use('/menu', menuRoutes); 
if (counterRoutes) router.use('/counters', counterRoutes); 
if (logRoutes) router.use('/logs', logRoutes); 

module.exports = router;