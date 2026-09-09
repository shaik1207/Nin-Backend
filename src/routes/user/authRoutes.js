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

// Auth Routes
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.post('/google', googleAuth);

module.exports = router;