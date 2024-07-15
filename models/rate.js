const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const RateSchema = new Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  rate: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  customer: {
    fullname: {
      type: String,
    },
  },
  content: {
    type: String,
  },
  created_at: {
    type: Date,
  },
});

const Rate = model('Rate', RateSchema);
module.exports = Rate;
