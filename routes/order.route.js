const express = require('express');

const router = express.Router();

const orderController = require('../controllers/order.controller');
const auth = require('../middlewares/auth');

router.post('/', auth.authUser, orderController.createOrder);

router.get('/', orderController.getAllOrder);
router.put('/:orderId', orderController.updateOrder);
router.post('/list-order-by-condition', orderController.listOrderByCondition);
router.delete('/:orderId', orderController.deleteOrder);
router.post('/return-product', orderController.cancelOrder);
router.post('/get-fee-ship', orderController.getFeeShip);
router.post('/change-order-status/', orderController.changeStatusOrder);
router.post('/get-order-detail', orderController.getOrderDetail);
router.post('/find-order', orderController.findOrder);
router.post('/create-order-ship', orderController.createShipOrder);
router.post('/list-order-by-status', orderController.listOrderByStatus);

// router.get('/get-order-status', orderController.listOrderByStatus);
router.post('/change-delivery', orderController.takeOrder);
router.post('/delivering', orderController.onDelivering);
router.post('/delivered', orderController.onDelivered);
router.post('/get-user-order', orderController.getUserOrder);
router.post('/get-order-finish', orderController.getOrderFinish);
router.post('/get-order-confirm', orderController.getOrderConfirm);
router.post('/delete-order-user', orderController.deleteOrderFromUser);
router.get('/:orderId', orderController.getOrder);

module.exports = router;
