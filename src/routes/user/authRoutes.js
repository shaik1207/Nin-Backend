const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  googleAuth
} = require('../../controllers/user/authController');

// Test Route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth Routes Working'
  });
});

// User Auth Routes
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);

// ✅ FIXED: Changed from '/google' to '/user/google' to match frontend requests exactly
router.post('/user/google', googleAuth); 

module.exports = router;