const { Counters } = require('../../models');

exports.getCounterStatus = async (req, res) => {
  try {
    // If you are passing the counterId in the query (e.g. /api/counter/status?counterId=123)
    const counterId = req.query.counterId;
    
    if (counterId) {
      const counter = await Counters.findByPk(counterId);
      if (counter) {
        return res.status(200).json({
          success: true,
          data: { status: counter.status, location: counter.location }
        });
      }
    }

    // Fallback: Global status check if no specific counter ID is provided
    return res.status(200).json({
      success: true,
      data: {
        status: "Active",
        message: "System is online and accepting orders."
      }
    });

  } catch (error) {
    console.error("❌ Counter Status Check Error:", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
};