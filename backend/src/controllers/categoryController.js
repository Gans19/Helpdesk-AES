const { matchedData } = require('express-validator');
const categoryModel = require('../models/categoryModel');
const pool = require('../config/database');

const list = async (_req, res, next) => {
  try {
    const categories = await categoryModel.listCategories();
    return res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const existing = await categoryModel.findByName(data.name);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists'
      });
    }

    const created = await categoryModel.createCategory({
      name: data.name,
      description: data.description || null
    });

    return res.status(201).json({
      success: true,
      message: 'Category created',
      data: created
    });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const id = Number(req.params.id);

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const updated = await categoryModel.updateCategory(id, {
      name: data.name,
      description: data.description || null
    });

    return res.json({
      success: true,
      message: 'Category updated',
      data: updated
    });
  } catch (error) {
    return next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const [rows] = await pool.execute(
      'SELECT id FROM tickets WHERE category_id = ? LIMIT 1',
      [id]
    );
    if (rows.length) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing tickets'
      });
    }

    await categoryModel.deleteCategory(id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
  create,
  update,
  destroy
};

