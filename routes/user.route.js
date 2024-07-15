const router = require('express').Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth');

router.get('/', auth.authAdmin, userController.listUser);
router.post('/', userController.createUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);
router.post('/login', userController.login);
router.post('/login-admin', userController.loginAdmin);
router.post('/login-shipper', userController.loginShipper);
router.get('/getUser', auth.authUser, userController.getUser);

router.post('/createUser', userController.createUserAdmin);
router.post('/create-shipper', userController.createShipper);
router.get('/getShipper', userController.listAllCustomer);
router.get('/get-list-user', userController.listAllUser);
router.get('/get-list-shipper', userController.listAllShipper);
router.get('/find-user', userController.findUserByName);
router.post('/change-pass', auth.authUser, userController.changePass);
router.post('/forgot-password-admin', userController.forgotPasswordAdmin);
router.post('/forgot-password', userController.forgotPassword);

module.exports = router;
