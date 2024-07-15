const Banner = require('../models/banner');

module.exports = {
  async createBanner(req, res) {
    try {
      const banner = new Banner(req.body);

      await banner.save();

      res.status(200).send(banner);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async listAllBanner(req, res) {
    try {
      const bannbers = await Banner.find().limit(4).sort({ level: 1 });

      res.status(200).send(bannbers);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async editBanner(req, res) {
    try {
      await Banner.findByIdAndUpdate(req.params.bannerId, req.body, { new: true });

      res.status(200).send();
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async deleteBanner(req, res) {
    try {
      await Banner.findByIdAndDelete(req.params.bannerId);

      res.status(200).send();
    } catch (error) {
      res.status(404).send(error);
    }
  },
};
