const express = require('express');
const router = express.Router();
const customerController = require("./../controllers/customer.controller.js");
const jwt = require('jsonwebtoken')

const auth = require('../auth/auth');
router.post('/customer/new', customerController.create)
router.get('/customer/all', customerController.getAll)
router.put('/customer/update/:customerId', customerController.updateById)
router.delete('/customer/delete/:customerId', customerController.deleteById)
router.get('/customer/:customerId', customerController.getById)

module.exports = router