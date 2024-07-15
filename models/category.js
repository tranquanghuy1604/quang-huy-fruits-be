const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
  },
});

const Category = model('Category', CategorySchema);
module.exports = Category;
