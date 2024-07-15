const router = require('express').Router();
const rateController = require('../controllers/rate.controller');

router.get('/:orderId', rateController.getProductRate);
router.post('/', rateController.createRate);

module.exports = router;
