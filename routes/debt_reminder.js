const express = require('express');
const router = express.Router();
const debt = require("./../controllers/debt_reminder.js")
const auth = require('../auth/auth');

router.post('/debt/new/', auth, debt.create)
router.post('/debt/new/:transaction_id', auth, debt.create); 
router.get('/debt/all', debt.getAll)
router.put('/debt/update/:customerId', debt.updateById)
router.delete('/debt/delete/:customerId', debt.deleteById)
router.get('/debt/:customerId', debt.getById)

module.exports = router