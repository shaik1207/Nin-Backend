const { MenuItem } = require('../../models');

exports.getMenu = async (req, res, next) => {
  try {
    const items = await MenuItem.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const { name, category, price, time, badge, day, status } = req.body;
    
    // Generate the public URL for the uploaded image
    const imageUrl = req.file ? `/uploads/menu/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const newItem = await MenuItem.create({
      name,
      category,
      price,
      time,
      badge: badge === 'None' ? null : badge,
      day: day || 'Everyday', // ✅ Saves the scheduled day
      status,
      image: imageUrl
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    next(error);
  }
};

// ✅ ADDED THIS MISSING FUNCTION: Required to edit/update menu items without a 500 error
exports.updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, price, time, badge, day, status } = req.body;

    const item = await MenuItem.findByPk(id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.name = name || item.name;
    item.category = category || item.category;
    item.price = price || item.price;
    item.time = time || item.time;
    item.badge = badge === 'None' ? null : badge;
    item.day = day || item.day; // ✅ Updates the scheduled day
    item.status = status || item.status;

    // If a new image was uploaded during edit, replace the old image path
    if (req.file) {
      item.image = `/uploads/menu/${req.file.filename}`;
    }

    await item.save();

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const item = await MenuItem.findByPk(id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.status = status;
    await item.save();

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByPk(id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    await item.destroy();
    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (error) {
    next(error);
  }
};