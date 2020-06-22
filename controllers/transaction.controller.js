const Response = require("../util/response_manager");
const HttpStatus = require("../util/http_status");
const Transaction = require("../models/transaction");
const CustomerModel = require('../models/customer');
const UserModel = require("../models/user");
const StoreModel = require("../models/store");

// Create and Save a new Transaction
exports.create = async (req, res, next) => {
    try {
        const {
            amount,
            interest,
            total_amount,
            description
        } = req.body;

        var req_keys = [
            amount,
            interest,
            total_amount,
            description
        ];

        for (var k in req_keys) {
            if (!req_keys[k]) {
                //console.log(k)
                throw "fail"
            }
        };
        // gets user_ref_id
        const user_ref_id = UserModel.find({
            email: req.user.email
        }, function (err, result) {
            if (err) {
                throw err
            };
            return result[0]._id;
        });


        // gets customer_ref_id
        const customer_ref_id = CustomerModel.findOne({
            phone_number: req.body.phone_number
        }, function (err, result) {
            if (err) {
                throw err
            };
            return result._id;
        });
        // gets store_ref_id
        const store_ref_id = StoreModel.find({
            store_name: req.body.store_name
        }, function (err, result) {
            if (err) {
                throw err
            };
            return result[0]._id;
        });

        let transaction = new Transaction({
            amount: amount,
            interest: interest,
            total_amount: total_amount,
            description: description,
            user_ref_id: user_ref_id,
            customer_ref_id: customer_ref_id,
            store_ref_id: store_ref_id,
            transaction_name: req.body.transaction_name,
            transaction_role: req.body.transaction_role
        });

        //console.log(transaction);

        if (!transaction) {
            throw "fail";
        }

        // Save Transaction in the database
        transaction.save();

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
    try {
        const query = {
            user_ref_id: UserModel.findOne({
                email: req.user.email
            }, function (err, result) {
                if (err) {
                    throw err
                };
                return result._id;
            })
        };


        // gets store_ref_id
        StoreModel.find({
            email: req.user.email
        }, function (err, result) {
            if (err) {
                throw err
            };
        });
        //console.log("Found.")

        Transaction.find(query)
            .then(transactions => {
                res.send(transactions);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving transactions."
                });
            });
    } catch (error) {
        res.status(500).send({
            status: "fail",
            message: error.message || "Some error occurred while creating the transaction.",
        });
    }
};

// Find a single transaction with a transaction_id
exports.findOne = async (req, res, next) => {
    try {
        // gets user_ref_id
        const user_ref_id = UserModel.find({
            email: req.user.email
        }, function (err, result) {
            if (err) {
                throw err
            };
            return result[0]._id;
        });


        // gets store_ref_id
        StoreModel.find({
            email: req.user.email
        }, function (err, result) {
            if (err) {
                throw err
            };
        });
        //console.log("Found.")


        Transaction.findOne({
                user_ref_id: user_ref_id,
                _id: req.params.transaction_id
            })
            .then(transaction => {
                if (!transaction) {
                    return res.status(404).send({
                        message: "Transaction not found with id " + req.params.transaction_id
                    });
                }
                res.send(transaction);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Transaction not found with id " + req.params.transaction_id
                    });
                }
                return res.status(500).send({
                    message: "Error retrieving transaction with id " + req.params.transaction_id
                });
            });
    } catch (error) {
        res.status(500).send({
            status: "fail",
            message: error.message || "Some error occurred while creating the transaction.",
        });
    }
};

// Update a transaction identified by the transaction_id in the request
exports.update = async (req, res, next) => {
    try {
        // Validate Request
        if (!req.body) {
            return res.status(400).send({
                message: "Transaction content can not be empty"
            });
        }

        // gets user_ref_id
        const user_ref_id = UserModel.find({
            email: req.user.email
        }, function (err, result) {
            if (err) {
                throw err
            };
            return result[0]._id;
        });

        // gets store_ref_id
        StoreModel.find({
            email: req.user.email
        }, function (err, result) {
            if (err) {
                throw err
            };
            //console.log("Found.")
        });

        // Find transaction and update it with the request body
        Transaction.updateOne({
                    _id: req.params.transaction_id,
                    user_ref_id: user_ref_id
                },
                req.body, {
                    new: true
                }
            )
            .then(transaction => {
                if (!transaction) {
                    return res.status(404).send({
                        message: "Transaction not found with id " + req.params.transaction_id
                    });
                }
                res.send(transaction);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Transaction not found with id " + req.params.transaction_id
                    });
                }
                return res.status(500).send({
                    message: "Error updating transaction with id " + req.params.transaction_id
                });
            });
    } catch (error) {
        res.status(500).send({
            status: "fail",
            message: error.message || "Some error occurred while creating the transaction.",
        });
    }
};

// Delete a transaction with the specified transaction_id in the request
exports.delete = async (req, res, next) => {
    try {
        Transaction.findByIdAndRemove(req.params.transaction_id)
            .then(transaction => {
                if (!transaction) {
                    return res.status(404).send({
                        message: "Transaction not found with id " + req.params.transaction_id
                    });
                }
                res.send({
                    message: "Transaction deleted successfully!"
                });
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "Transaction not found with id " + req.params.transaction_id
                    });
                }
                return res.status(500).send({
                    message: "Could not delete transaction with id " + req.params.transaction_id
                });
            });
    } catch (error) {
        res.status(500).send({
            status: "fail",
            message: error.message || "Some error occurred while creating the transaction.",
        });
    }
};
