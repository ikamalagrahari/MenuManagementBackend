const express = require('express');
const Item = require('../models/Item');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const { validateItem } = require('../middleware/validation');

const router = express.Router();

// Create Item under a subcategory or category
router.post('/', validateItem, async (req, res) => {
  try {
    const { name, image, description, taxApplicability, tax, baseAmount, discount, categoryId, subcategoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    if (subcategoryId) {
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({ error: 'Subcategory not found' });
      }
    }
    const totalAmount = baseAmount - (discount || 0);
    const item = new Item({
      name,
      image,
      description,
      taxApplicability,
      tax,
      baseAmount,
      discount,
      totalAmount,
      category: categoryId,
      subcategory: subcategoryId,
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('category').populate('subcategory');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all items under a category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const items = await Item.find({ category: categoryId }).populate('category').populate('subcategory');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all items under a subcategory
router.get('/subcategory/:subcategoryId', async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const items = await Item.find({ subcategory: subcategoryId }).populate('category').populate('subcategory');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get item by ID or name
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let item;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId
      item = await Item.findById(identifier).populate('category').populate('subcategory');
    } else {
      // It's a name
      item = await Item.findOne({ name: identifier }).populate('category').populate('subcategory');
    }
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.baseAmount !== undefined || updates.discount !== undefined) {
      const item = await Item.findById(id);
      if (item) {
        updates.totalAmount = (updates.baseAmount || item.baseAmount) - (updates.discount || item.discount);
      }
    }
    const item = await Item.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('category').populate('subcategory');
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search items by name
router.get('/search/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const items = await Item.find({ name: { $regex: name, $options: 'i' } }).populate('category').populate('subcategory');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;