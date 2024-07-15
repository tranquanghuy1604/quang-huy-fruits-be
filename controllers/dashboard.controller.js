const OrderDetail = require('../models/orderDetail');
const Product = require('../models/product');
const Order = require('../models/order');

module.exports = {
  async getTopBestSell(req, res) {
    try {
      const topSell = await OrderDetail.aggregate([
        {
          $project: {
            order_id: 1,
            product: 1,
            quantity: 1,
          },
        },
        {
          $group: {
            _id: {
              product: '$product',
            },
            quantity: { $sum: '$quantity' },
          },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id.product',
            foreignField: '_id',
            as: '_id.product',
          },
        },
        {
          $sort: {
            quantity: -1,
          },
        },
      ]);

      res.status(200).send(topSell);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async getCapital(req, res) {
    try {
      const products = await Product.find();
      let capital = 0;
      // eslint-disable-next-line no-return-assign
      products.forEach((r) => (capital += r.price * r.amount));

      res.status(200).send({ capital });
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async getRevenue(req, res) {
    try {
      const productDetails = await OrderDetail.find().populate('product');

      let revenue = 0;
      // eslint-disable-next-line no-return-assign
      productDetails.forEach((r) => (revenue += r.product.price * r.quantity));
      res.status(200).send({ revenue });
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async getDataChart(req, res) {
    try {
      const data = await Order.aggregate([
        {
          $sort: { created_at: -1 },
        },
        {
          $project: {
            date: { $dateToString: { format: '%d-%m-%Y', date: '$created_at' } },
          },
        },
        {
          $addFields: {
            count: 1,
          },
        },
        {
          $group: {
            _id: {
              date: '$date',
            },
            count: { $sum: '$count' },
          },
        },
        // {
        //   $lookup: {
        //     from: 'orderdetails',
        //     localField: 'order',
        //     foreignField: 'order_id',
        //     as: 'orders',
        //   },
        // },
      ]);
      const chartLabel = data.map((r) => r._id.date);
      const chartData = data.map((r) => r.count);

      res.status(200).send({ chartLabel, chartData });
    } catch (error) {
      res.status(404).send(error);
    }
  },
};
