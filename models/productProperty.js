const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ProductPropertySchema = new Schema({
  key: {
    type: String,
  },
  value: {
    type: String,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const ProductProperty = model('ProductProperty', ProductPropertySchema);
module.exports = ProductProperty;
