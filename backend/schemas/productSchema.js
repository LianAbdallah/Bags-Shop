const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['kids','women','men']
  },
  image: {
    type: String,
    required: true,
  }
});

module.exports = productSchema;


