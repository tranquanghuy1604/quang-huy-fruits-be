const express = require('express');

const router = express.Router();

const orderController = require('../controllers/order.controller');
const promotionController = require('../controllers/promotion.controller');

router.get('/', promotionController.getAllPromotion);
router.post('/', promotionController.createPromotion);
router.put('/:promotionId', promotionController.editPromotion);
router.get('/:promotionId', promotionController.getPromotion);
router.delete('/:promotionId', promotionController.deletePromotion);
module.exports = router;
