const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
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
    default: function() {
      // Default to category's taxApplicability
      return this.category ? this.category.taxApplicability : false;
    },
  },
  tax: {
    type: Number,
    default: function() {
      // Default to category's tax
      return this.category ? this.category.tax : 0;
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subcategory', subcategorySchema);