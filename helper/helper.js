const Order = require('../models/order');
const Product = require('../models/product');

async function updateProuctQuantity(productId, quantity) {
  try {
    const product = await Product.findById(productId);
    if (quantity <= product.amount) {
      product.amount -= quantity;
      await product.save();
      return null;
    } else {
      return `còn lại ${product.amount} sản phẩm ${product.name}`;
    }
    // await product.save();
    // return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

async function returnProuctQuantity(productId, quantity) {
  try {
    const product = await Product.findById(productId);
    product.amount += quantity;
    await product.save();
    return Promise.resolve(product);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function autoCheckOrder() {
  try {
    const orders = await Order.find({ payment_method: 'online', payment: false });

    if (orders.length > 0) {
      const order = orders.shift();
      const expiredTime = new Date().getTime() - order.created_at.getTime().getTime();
      if (expiredTime > 10000) {
        await Order.findByIdAndDelete(order._id);
      }
      await autoCheckOrder();
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

// async function checkExistProduct() {
//   try {
//     const
//   } catch (error) {

//   }
// }

module.exports = {
  updateProuctQuantity,
  returnProuctQuantity,
  autoCheckOrder,
};
