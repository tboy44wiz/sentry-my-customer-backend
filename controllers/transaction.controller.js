const Response = require("../util/response_manager");
const HttpStatus = require("../util/http_status");
const Transaction = require("../models/transaction");


// Create and Save a new Transaction
exports.create = async (req, res, next) => {
  try {
    let transaction = new Transaction(req.body);

    // Save Transaction in the database
    transaction.save();

    if (!transaction) {
      throw "fail";
    }

    res.status(200).json({
      status: "success",
      result: transaction.length,
      data: {
        transaction,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "fail",
      message: error.message || "Some error occurred while creating the transaction.",
    });
  }
};

// Retrieve and return all transactions from the database.
exports.findAll = async (req, res, next) => {
    Transaction.find()
    .then(transactions => {
        res.send(transactions);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving transactions."
        });
    });
};

// Find a single transaction with a transaction_id
exports.findOne = async (req, res, next) => {
    Transaction.findById(req.params.transaction_id)
    .then(transaction => {
        if(!transaction) {
            return res.status(404).send({
                message: "Transaction not found with id " + req.params.transaction_id
            });            
        }
        res.send(transaction);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Transaction not found with id " + req.params.transaction_id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving transaction with id " + req.params.transaction_id
        });
    });
};

// Update a transaction identified by the transaction_id in the request
exports.update = async (req, res, next) => {
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Transaction content can not be empty"
        });
    }

    // Find transaction and update it with the request body
    Transaction.findByIdAndUpdate(
		req.params.transaction_id,
		req.body,
		{new: true}
	)
    .then(transaction => {
        if(!transaction) {
            return res.status(404).send({
                message: "Transaction not found with id " + req.params.transaction_id
            });
        }
        res.send(transaction);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Transaction not found with id " + req.params.transaction_id
            });                
        }
        return res.status(500).send({
            message: "Error updating transaction with id " + req.params.transaction_id
        });
    });
};

// Delete a transaction with the specified transaction_id in the request
exports.delete = async (req, res, next) => {
    Transaction.findByIdAndRemove(req.params.transaction_id)
    .then(transaction => {
        if(!transaction) {
            return res.status(404).send({
                message: "Transaction not found with id " + req.params.transaction_id
            });
        }
        res.send({message: "Transaction deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Transaction not found with id " + req.params.transaction_id
            });                
        }
        return res.status(500).send({
            message: "Could not delete transaction with id " + req.params.transaction_id
        });
    });
};
