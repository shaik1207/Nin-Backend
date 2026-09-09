const { Category } = require('../../models');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, desc, status } = req.body;
    const newCategory = await Category.create({ name, desc, status, items: 0 });
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const category = await Category.findByPk(id);
    
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    category.status = status;
    await category.save();

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    await category.destroy();
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};