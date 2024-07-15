const Category = require('../models/category');
const Product = require('../models/product');

module.exports = {
  async createCategory(req, res) {
    try {
      const category = new Category(req.body);
      await category.save();

      res.status(200).send(category);
    } catch (error) {
      res.status(409).send(error);
    }
  },
  async deleteCategory(req, res) {
    try {
      const product = await Product.findOne({ category_id: req.params.categoryId });
      if (product) return res.status(405).send({ error: 'You must delete all products in category!!' });
      await Category.findByIdAndDelete(req.params.categoryId);

      return res.status(200).send();
    } catch (error) {
      return res.status(404).send(error);
    }
  },
  async listAllCategory(req, res) {
    try {
      const categories = await Category.find({}).sort({ level: 1 }).exec();

      res.status(200).send(categories);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async editCategory(req, res) {
    try {
      await Category.findByIdAndUpdate(req.params.categoryId, { new: true }, req.body);

      res.status(200).send();
    } catch (error) {
      res.status(404).send(error);
    }
  },
};
