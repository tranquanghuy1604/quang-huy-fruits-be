const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');

router.get('/list-top-sell', dashboardController.getTopBestSell);
router.get('/capital', dashboardController.getCapital);
router.get('/revenue', dashboardController.getRevenue);
router.get('/get-chart-data', dashboardController.getDataChart);

module.exports = router;
