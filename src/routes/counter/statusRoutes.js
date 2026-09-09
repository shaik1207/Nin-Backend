const express = require('express');
const router = express.Router();
const { Counters } = require('../../models');

// GET /api/counter/status
router.get('/', async (req, res) => {
  try {
    const { counterId } = req.query;
    
    if (counterId) {
      const counter = await Counters.findByPk(counterId);
      if (counter) {
        return res.status(200).json({
          success: true,
          data: { status: counter.status, location: counter.location }
        });
      }
    }

    // Default global response if no specific ID is queried
    return res.status(200).json({
      success: true,
      data: { status: "Active", message: "Counter system is online." }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;