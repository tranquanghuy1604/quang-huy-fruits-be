const mongoose = require('mongoose');

const { Schema } = mongoose;

const CartSchema = new Schema({
  products: [],
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
