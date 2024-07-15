const router = require('express').Router();
const productController = require('../controllers/product.controller');
const categoryController = require('../controllers/category.controller');

router.route('/')
  .get(categoryController.listAllCategory)
  .post(productController.createCategory);

router.delete('/:categoryId', productController.deleteCategory);

module.exports = router;
