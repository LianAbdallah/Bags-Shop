const mongoose = require('mongoose');
const reviewSchema = require('../schemas/reviewSchema');
const BaseModel = require('./BaseModel');

const Review = mongoose.model('Review', reviewSchema);

class ReviewModel extends BaseModel {
  constructor() {
    super(Review);
  }
}

module.exports = ReviewModel;