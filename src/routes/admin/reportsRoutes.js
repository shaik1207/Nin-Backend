const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/admin/reportsController');

// Diagnostic safety checks to prevent 'argument handler must be a function' errors
if (typeof reportsController.getDashboardStats !== 'function') {
  console.error("❌ CRITICAL: reportsController.getDashboardStats is NOT a function!");
}
if (typeof reportsController.getReportsOverview !== 'function') {
  console.error("❌ CRITICAL: reportsController.getReportsOverview is NOT a function!");
}

// GET /api/admin/reports/dashboard
router.get('/dashboard', reportsController.getDashboardStats);

// GET /api/admin/reports/overview
router.get('/overview', reportsController.getReportsOverview);

module.exports = router;