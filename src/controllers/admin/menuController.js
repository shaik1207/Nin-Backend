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
    
    // ✅ FIXED: Check for a physical file upload first, fallback to a pasted URL string second
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/menu/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const newItem = await MenuItem.create({
      name,
      category,
      price,
      time,
      badge: badge === 'None' ? null : badge,
      day: day || 'Everyday',
      status,
      image: imageUrl
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    next(error);
  }
};

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
    item.day = day || item.day;
    item.status = status || item.status;

    // ✅ FIXED: Support updating the image via a newly uploaded file OR a new pasted URL
    if (req.file) {
      item.image = `/uploads/menu/${req.file.filename}`;
    } else if (req.body.image) {
      item.image = req.body.image;
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