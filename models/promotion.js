const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const PromotionSchema = new Schema({
  name: {
    type: String,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    require: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  discount: {
    type: Number,
  },
});

const Promotion = model('Promotion', PromotionSchema);
module.exports = Promotion;
