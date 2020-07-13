const express = require('express');
const router = express.Router();
const UserDebtController = require("../controllers/user_debt_reminder");
const auth = require("../auth/auth");

router.post('/user_debt/new', auth, UserDebtController.create);
router.post('/user_debt/new/:transaction_id', auth, UserDebtController.create);
router.get('/user_debt', auth, UserDebtController.getAll)
router.put('/user_debt/update/:customerId', auth, UserDebtController.updateById);
router.delete('/user_debt/delete/:customerId', auth, UserDebtController.deleteById);
router.get('/user_debt/:customerId', auth, UserDebtController.getById);

module.exports = router