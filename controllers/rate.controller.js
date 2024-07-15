const Rate = require('../models/rate');

module.exports = {
  async createRate(req, res) {
    try {
      const rate = new Rate({
        ...req.body,
        created_at: Date.now(),
      });
      await rate.save();

      res.status(200).send(rate);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getProductRate(req, res) {
    try {
      const rates = await Rate.find({ orderId: req.params.order_id });

      res.status(200).send(rates);
    } catch (error) {
      res.status(404).send(error);
    }
  },
};
