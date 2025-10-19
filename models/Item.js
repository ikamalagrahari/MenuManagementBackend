const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  taxApplicability: {
    type: Boolean,
    required: true,
  },
  tax: {
    type: Number,
    required: function() {
      return this.taxApplicability;
    },
  },
  baseAmount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: function() {
      return this.baseAmount - this.discount;
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    // Optional, can be under category directly
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Item', itemSchema);