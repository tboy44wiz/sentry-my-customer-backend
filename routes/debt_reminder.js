const express = require('express');
const router = express.Router();
const debt = require("./../controllers/debt_reminder.js")

router.post('/debt/new', debt.create)
router.get('/debt/all', debt.getAll)
router.put('/debt/update/:customerId', debt.updateById)
router.delete('/debt/delete/:customerId', debt.deleteById)
router.get('/debt/:customerId', debt.getById)

module.exports = router