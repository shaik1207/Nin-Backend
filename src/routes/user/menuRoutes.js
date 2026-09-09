const express = require('express');
const router = express.Router();
const { MenuItem } = require('../../models');

// GET /api/menu -> Fetches available items for the frontend customer
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.findAll({ 
      where: { status: 'Available' },
      order: [['category', 'ASC']] 
    });
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error("❌ Public Menu Fetch Error:", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
});

module.exports = router;