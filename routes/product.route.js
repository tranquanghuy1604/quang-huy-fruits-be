const router = require('express').Router();
const multer = require('multer');
const productController = require('../controllers/product.controller');
const upload = multer({ dest: 'uploads/' });

router.route('/').get(productController.listAllProduct);
router.route('/').post(upload.array('images'), productController.createProduct);

router
  .route('/:productId')
  .get(productController.getProduct)
  .put(upload.array('images'), productController.editProduct)
  .delete(productController.deleteProduct);

router
  .route('/property/:productId')
  .post(productController.createProductProp)
  .delete(productController.deleteProductProp);

router.post('/get-product-by-category', productController.getProductByCategory);
router.post('/list-product-by-condition', productController.listProductByCondition);

module.exports = router;
