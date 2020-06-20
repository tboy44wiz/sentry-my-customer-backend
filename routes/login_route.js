const express = require('express');
const LoginController = require('../controllers/login_controler');

const router = express.Router();

//User registration route
router.post('/user', LoginController.loginUser);

//Customer registration route
router.post('/customer', LoginController.loginCustomer);

module.exports = router;
