const express = require('express');
const router = express.Router();
const customerController = require("./../controllers/customer.controller.js");

router.post('/customer/new', customerController.create)
//router.get('/customer/:customerId', customerController.getById)
//router.put('/customer/update/:customerId', customerController.updateById)
//router.delete('/customer/delete/:customerId', customerController.deleteById)
router.get('/customer/all', customerController.getAll)

module.exports = router