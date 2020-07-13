const express = require('express');
const router = express.Router();
const CreditController = require("../controllers/user_dept_reminder");
const auth = require("../auth/auth");

router.post('/credit/new', auth, CreditController.create)
router.post('/credit/new/:transaction_id', auth, CreditController.create)
router.get('/credit', auth, CreditController.getAll)
router.put('/credit/update/:customerId', auth, CreditController.updateById)
router.delete('/credit/delete/:customerId', auth, CreditController.deleteById)
router.get('/credit/:customerId', auth, CreditController.getById)

module.exports = router