const { User, MenuItem, Inventory } = require('../models');

exports.getDashboardSummary = async () => {
  const totalUsers = await User.count();
  const totalMenuItems = await MenuItem.count();
  const lowStockItems = await Inventory.count({
    where: {
      stockQuantity: { [require('sequelize').Op.lte]: sequelize.col('lowStockThreshold') }
    }
  });

  return {
    totalUsers,
    totalMenuItems,
    lowStockItems
  };
};