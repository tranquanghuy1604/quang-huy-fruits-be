const express = require('express');

const router = express.Router();
const locationController = require('../controllers/location.controller');

router.get('/province', locationController.getProvince);
router.get('/district', locationController.getDistrict);
router.get('/ward', locationController.getWard);

module.exports = router;
