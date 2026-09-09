const { Inventory, MenuItem } = require('../../models');

exports.getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.findAll({
      include: [{ model: MenuItem, attributes: ['name', 'isAvailable'] }]
    });
    res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const { stockQuantity, lowStockThreshold } = req.body;
    const item = await Inventory.findOne({ where: { menuItemId: req.params.menuItemId } });
    
    if (!item) return res.status(404).json({ success: false, message: 'Inventory record not found' });
    
    await item.update({ stockQuantity, lowStockThreshold });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};