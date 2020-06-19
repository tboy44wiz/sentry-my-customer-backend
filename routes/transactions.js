const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactions");

router.get("/all", transactionController.getAllTransactions);

module.exports = router;
