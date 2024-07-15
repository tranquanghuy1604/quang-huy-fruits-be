const axios = require('axios');
const { MyError } = require('../configs/myError');
const Promotion = require('../models/promotion');

module.exports = {
  async getAllPromotion(req, res) {
    try {
      const currentDate = new Date();
      const promotion = await Promotion.find({
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
      }).populate('product_id');

      res.status(200).send(promotion);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async createPromotion(req, res) {
    try {
      const promotion = new Promotion(req.body);
      await promotion.save();

      res.status(200).send(promotion);
    } catch (error) {
      res.status(409).send(error);
    }
  },
  async editPromotion(req, res) {
    try {
      await Promotion.findByIdAndUpdate(req.params.promotionId, req.body, { new: true });

      res.status(200).send();
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async getPromotion(req, res) {
    try {
      const promotion = await Promotion.findById(req.params.promotionId);

      res.status(200).send(promotion);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async deletePromotion(req, res) {
    try {
      await Promotion.findByIdAndDelete(req.params.promotionId);

      res.status(200).send();
    } catch (error) {
      res.status(404).send();
    }
  },
};
