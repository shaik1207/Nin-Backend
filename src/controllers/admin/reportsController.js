const { User, Log, MenuItem, Order, sequelize } = require('../../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalUsers = await User.count();
    const todayActivity = await Log.count({
      where: { createdAt: { [Op.gte]: today } }
    }).catch(() => 0); 

    const activeOrders = await Order.count({ 
      where: { status: { [Op.in]: ['Pending', 'Preparing', 'Ready'] } } 
    });

    const totalMenuItems = await MenuItem.count({
      where: { status: 'Available' }
    });

    const todayRevenue = await Order.sum('totalAmount', {
      where: {
        createdAt: { [Op.gte]: today },
        paymentStatus: 'Paid'
      }
    });

    const recentOrders = await Order.findAll({
      include: [{ model: User, as: 'user', attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        todayActivity,
        activeOrders,
        totalMenuItems,
        revenueToday: todayRevenue || 0,
        recentOrders
      }
    });
  } catch (error) {
    console.error("❌ Admin Dashboard Fetch Error:", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
};

exports.getReportsOverview = async (req, res, next) => {
  try {
    const totalRevenue = await Order.sum('totalAmount', { where: { paymentStatus: 'Paid' } }) || 0;
    const totalOrders = await Order.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const totalFoods = await MenuItem.count({ where: { status: 'Available' } });

    const dailyReportsRaw = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'dateString'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'ordersCount'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'dailyRevenue'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('userId'))), 'uniqueUsers']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'DESC']],
      limit: 30,
      raw: true
    });

    const dailyReports = dailyReportsRaw.map((report, index) => {
      const reportId = `RPT-${String(index + 1).padStart(3, '0')}`;
      return {
        id: reportId,
        date: report.dateString,
        orders: parseInt(report.ordersCount, 10),
        revenue: parseFloat(report.dailyRevenue) || 0,
        users: parseInt(report.uniqueUsers, 10),
        status: 'Completed' 
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          revenue: totalRevenue,
          orders: totalOrders,
          users: activeUsers,
          foods: totalFoods
        },
        reports: dailyReports
      }
    });
  } catch (error) {
    console.error("❌ Admin Reports Overview Error:", error.message);
    return res.status(500).json({ success: false, message: `DB Error: ${error.message}` });
  }
};