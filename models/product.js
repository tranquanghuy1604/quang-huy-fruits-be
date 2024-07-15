const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
  cost_price: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  tag: {
    type: Array,
  },
  properties: {
    type: Array,
  },
  unit: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
  amount: {
    type: Number,
    default: 0,
  },
  sale: {
    type: String,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
  },
  promotion_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Promotion',
  },
});

const Product = model('Product', ProductSchema);
module.exports = Product;
