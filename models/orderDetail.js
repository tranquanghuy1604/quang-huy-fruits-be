const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const OrderDetailSchema = new Schema({
  order_id: {
    type: String,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
  },
});

const OrderDetail = model('OrderDetail', OrderDetailSchema);
module.exports = OrderDetail;
