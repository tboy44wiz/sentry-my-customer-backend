const express = require("express");
const router = express.Router();
const transactions = require('../controllers/transaction.controller.js');

// Create a new Transaction
router.post('/transaction/new', transactions.create);

// Retrieve all Transactions
router.get('/transaction/all', transactions.findAll);

// Retrieve a single Transaction with transaction_id
router.get('/transaction/:transaction_id', transactions.findOne);

// Update a Transaction with transaction_id
router.put('/transaction/update/:transaction_id', transactions.update);

// Delete a Transaction with transaction_id
router.delete('/transaction/delete/:transaction_id', transactions.delete);

module.exports = router;
