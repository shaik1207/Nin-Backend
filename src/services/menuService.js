const { MenuItem, Category, Inventory } = require('../models');

exports.createMenuItem = async (data) => {
  const item = await MenuItem.create(data);
  // Auto-initialize inventory record for the new menu item
  await Inventory.create({ menuItemId: item.id, stockQuantity: data.initialStock || 0 });
  return item;
};

exports.getAllMenuItems = async () => {
  return await MenuItem.findAll({
    include: [
      { model: Category, attributes: ['name'] },
      { model: Inventory, attributes: ['stockQuantity', 'lowStockThreshold'] }
    ]
  });
};

exports.updateMenuItem = async (id, data) => {
  const item = await MenuItem.findByPk(id);
  if (!item) throw new Error('Menu item not found');
  return await item.update(data);
};

exports.deleteMenuItem = async (id) => {
  const item = await MenuItem.findByPk(id);
  if (!item) throw new Error('Menu item not found');
  await item.destroy();
  return true;
};