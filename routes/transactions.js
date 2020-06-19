const express = require("express");
const router = express.Router();
const transactions = require('../controllers/transaction.controller.js');

// Create a new Transaction
router.post('/transactions/new', transactions.create);

// Retrieve all Transactions
router.get('/transactions/all', transactions.findAll);

// Retrieve a single Transaction with transaction_id
router.get('/transactions/:transaction_id', transactions.findOne);

// Update a Transaction with transaction_id
router.put('/transactions/update/:transaction_id', transactions.update);

// Delete a Transaction with transaction_id
router.delete('/transactions/delete/:transaction_id', transactions.delete);

module.exports = router;
