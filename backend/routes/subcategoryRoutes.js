const express = require('express');
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const { validateSubcategory } = require('../middleware/validation');

const router = express.Router();

// Create Subcategory under a category
router.post('/', validateSubcategory, async (req, res) => {
  try {
    const { name, image, description, taxApplicability, tax, categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const subcategory = new Subcategory({
      name,
      image,
      description,
      taxApplicability: taxApplicability !== undefined ? taxApplicability : category.taxApplicability,
      tax: tax !== undefined ? tax : category.tax,
      category: categoryId,
    });
    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all subcategories
router.get('/', async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('category');
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all subcategories under a category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Subcategory.find({ category: categoryId }).populate('category');
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subcategory by ID or name
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let subcategory;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId
      subcategory = await Subcategory.findById(identifier).populate('category');
    } else {
      // It's a name
      subcategory = await Subcategory.findOne({ name: identifier }).populate('category');
    }
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit subcategory
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const subcategory = await Subcategory.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('category');
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    res.json(subcategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;