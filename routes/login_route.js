const express = require('express');
const LoginController = require('../controllers/login_controler');

const router = express.Router();

//User registration route
router.post('/user/login', LoginController.loginUser);

//Customer registration route
router.post('/customer/login', LoginController.loginCustomer);

module.exports = router;
