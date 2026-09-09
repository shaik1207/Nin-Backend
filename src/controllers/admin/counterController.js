const { Counter, Order } = require('../../models');
const { Op } = require('sequelize');

exports.getCounters = async (req, res, next) => {
  try {
    const counters = await Counter.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, data: counters });
  } catch (error) {
    next(error);
  }
};

exports.createCounter = async (req, res, next) => {
  try {
    const { counterName, staffName, location, status } = req.body;
    
    const newCounter = await Counter.create({ 
      counterName, 
      staffName, 
      location, 
      status,
      password: 'defaultPassword123' // Set a default password initially
    });
    
    // Don't send the hashed password back to the client
    const counterData = newCounter.toJSON();
    delete counterData.password;

    res.status(201).json({ success: true, data: counterData });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const counter = await Counter.findByPk(id);
    if (!counter) return res.status(404).json({ success: false, message: 'Counter not found' });

    counter.status = status;
    await counter.save();

    res.status(200).json({ success: true, data: counter });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPass } = req.body;
    
    const counter = await Counter.findByPk(id);
    if (!counter) return res.status(404).json({ success: false, message: 'Counter not found' });

    // The Sequelize hook defined in the model will automatically hash this
    counter.password = newPass; 
    await counter.save();

    res.status(200).json({ success: true, message: 'Counter credentials updated securely' });
  } catch (error) {
    next(error);
  }
};

exports.deleteCounter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const counter = await Counter.findByPk(id);
    
    if (!counter) return res.status(404).json({ success: false, message: 'Counter not found' });

    await counter.destroy();
    res.status(200).json({ success: true, message: 'Counter deleted' });
  } catch (error) {
    next(error);
  }
};

// NEW: Fetch Real-Time Report for a specific Counter
exports.getCounterReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Calculate Today's Order Count for this Counter
    const ordersToday = await Order.count({
      where: {
        counterId: id,
        createdAt: { [Op.gte]: today }
      }
    });

    // 2. Calculate Today's Revenue for this Counter
    const revenueToday = await Order.sum('totalAmount', {
      where: {
        counterId: id,
        createdAt: { [Op.gte]: today },
        paymentStatus: 'Paid'
      }
    });

    // 3. Generate Weekly Trend (Last 7 Days)
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const count = await Order.count({
        where: {
          counterId: id,
          createdAt: {
            [Op.gte]: d,
            [Op.lt]: nextD
          }
        }
      });
      
      trend.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count: count
      });
    }

    res.status(200).json({
      success: true,
      data: {
        revenueToday: revenueToday || 0,
        ordersToday: ordersToday || 0,
        weeklyTrend: trend
      }
    });
  } catch (error) {
    next(error);
  }
};