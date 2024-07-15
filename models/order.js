const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const OrderSchema = new Schema({
  customer: {
    fullname: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    province: {
      type: Number,
    },
    district: {
      type: Number,
    },
    ward: {
      type: String,
    },
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  shipper_name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  created_at: {
    type: Date,
  },
  payment: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['waiting-confirm', 'waiting-delivery', 'pending', 'finish', 'deleted'],
    default: 'waiting-confirm',
  },
  payment_method: {
    type: String,
    enum: ['online', 'offline'],
  },
  note: {
    type: String,
  },
  ship_code: {
    type: Number,
  },
  total_price: {
    type: Number,
    required: true,
  },
  product_name: {
    type: Array,
  },
});

const Order = model('Order', OrderSchema);
module.exports = Order;
