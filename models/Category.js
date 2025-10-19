const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
  taxType: {
    type: String,
    required: function() {
      return this.taxApplicability;
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Category', categorySchema);