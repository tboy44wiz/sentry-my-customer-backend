const express = require('express');
const RegisterController = require('../controllers/register_controler');

const router = express.Router();

//User registration route
router.post('/register/user', RegisterController.registerUser);

//Customer registration route
router.post('/register/customer', RegisterController.registerCustomer);

module.exports = router;
