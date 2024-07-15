const express = require('express');

const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/create-payment-url', paymentController.createPaymentUrl);
router.post('/callback', paymentController.callback);
router.post('/order-status', paymentController.orderStatus);

module.exports = router;
