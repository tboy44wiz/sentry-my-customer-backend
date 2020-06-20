const Response = require("../util/response_manager");
const HttpStatus = require("../util/http_status");
const Transaction = require("../models/transaction");

exports.getAllTransactions = async (req, res, next) => {
  try {
    let transactions = await Transaction.find().select("-__v").sort({
      createdAt: -1,
    });

    if (!transactions) {
      return next(new Error("Something went wrong"));
    }

    res.status(200).json({
      status: "success",
      result: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
