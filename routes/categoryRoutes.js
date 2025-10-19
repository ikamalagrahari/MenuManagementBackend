const express = require('express');
const Category = require('../models/Category');
const { validateCategory } = require('../middleware/validation');

const router = express.Router();

// Create Category
router.post('/', validateCategory, async (req, res) => {
  try {
    const { name, image, description, taxApplicability, tax, taxType } = req.body;
    const category = new Category({ name, image, description, taxApplicability, tax, taxType });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get category by ID or name
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let category;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId
      category = await Category.findById(identifier);
    } else {
      // It's a name
      category = await Category.findOne({ name: identifier });
    }
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;