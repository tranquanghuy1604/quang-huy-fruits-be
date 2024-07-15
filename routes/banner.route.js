const router = require('express').Router();
const bannerController = require('../controllers/banner.controller');

router.route('/')
  .get(bannerController.listAllBanner)
  .post(bannerController.createBanner);

router.put('/:bannerId', bannerController.editBanner);
router.delete('/:bannerId', bannerController.deleteBanner);

module.exports = router;
