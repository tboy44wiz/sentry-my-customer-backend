const Response = require("../util/response_manager");
const HttpStatus = require("../util/http_status");
const Transaction = require("../models/transaction");
const UserModel = require("../models/store_admin");
const StoreModel = require("../models/store");

// Create and Save a new Transaction
exports.create = (req, res, next) => {
  let {
    amount,
    interest,
    total_amount,
    description,
    phone_number,
    store_name,
    type,
    transaction_name,
    transaction_role,
  } = req.body;

  let req_keys = {
    amount,
    interest,
    total_amount,
    description,
    type,
    transaction_name,
    transaction_role,
  };

  const identifier = req.user.phone_number;
  let store_ref_id;
  let customer_ref_id;

  UserModel.findOne({ identifier })
    .then((user) => {
      let stores = user.stores;
      stores.forEach((store) => {
        if (store.store_name == store_name) {
          store_ref_id = store._id;
          customers = store.customers;
          if (customers.length > 0) {
            customers.forEach((customer) => {
              if (customer.phone_number == phone_number) {
                customer_ref_id = customer._id;

                req_keys.customer_ref_id = customer_ref_id;
                req_keys.store_ref_id = store_ref_id;

                customer.transactions.push(req_keys);
              }
            });
          }
        }
      });
      if (customer_ref_id == undefined || store_ref_id == undefined) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone_number and/or store_name",
          error: {
            statusCode: 400,
            message: "Invalid phone_number and/or store_name",
          },
        });
      }
      user
        .save()
        .then((result) => {
          return res.status(201).json({
            success: true,
            message: "Transaction created",
            data: {
              details: req_keys,
            },
          });
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: "Error saving to database",
            error: {
              statusCode: 500,
              message: err,
            },
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: {
          code: 500,
          message: err,
        },
      });
    });
};

// Retrieve and return all transactions from the database.
exports.findAll = async (req, res, next) => {
  const identifier = req.user.phone_number;
  UserModel.findOne({ identifier })
    .then((user) => {
      let stores = user.stores;
      let details = [];

      stores.forEach((store) => {
        let customers = store.customers;
        customers.forEach((customer) => {
          let obj = {};
          obj.storeName = store.store_name;
          obj.customerName = customer.name;
          obj.transactions = customer.transactions;

          details.push(obj);

          return res.status(200).json({
            success: true,
            message: "Operation successful",
            data: {
              details,
            },
          });
        });
      });

      if (details.length == 0) {
        res.status(404).json({
          success: false,
          message: "No transaction associated with this user account",
          error: {
            code: 404,
            message: "No transaction associated with this user account",
          },
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Error fetching transactions",
        error: {
          code: 500,
          message: err,
        },
      });
    });
};

// Find a single transaction with a transaction_id
exports.findOne = (req, res, next) => {
  const identifier = req.user.phone_number;
  let details = [];
  UserModel.findOne({ identifier })
    .then((user) => {
      let stores = user.stores;
      stores.forEach((store) => {
        let customers = store.customers;
        customers.forEach((customer) => {
          let transactions = customer.transactions;
          transactions.forEach((transaction) => {
            if (transaction._id == req.params.transaction_id) {
              details.push(transaction);

              return res.status(200).json({
                success: true,
                Message: "Operation successful",
                data: {
                  transaction,
                },
              });
            }
          });
        });
      });
      if (details.length == 0) {
        res.status(404).json({
          success: false,
          Message: "Transaction not Found",
          error: {
            statusCode: 404,
            message: "Transaction not Found",
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        Message: "Error retriving transaction from database",
        error: {
          statusCode: 500,
          message: err,
        },
      });
    });
};

// Update a transaction identified by the transaction_id in the request
exports.update = async (req, res, next) => {
  try {
    // Validate Request
    if (!req.body) {
      return res.status(400).send({
        message: "Transaction content can not be empty",
      });
    }

    // gets user_ref_id
    var user_ref_id = UserModel.find(
      {
        email: req.user.email,
      },
      function (err, result) {
        if (err) {
          throw err;
        }
      }
    );

    user_ref_id = user_ref_id[0]._id;

    // gets store_ref_id
    StoreModel.find(
      {
        email: req.user.email,
      },
      function (err, result) {
        if (err) {
          throw err;
        }
        //console.log("Found.")
      }
    );

    // Find transaction and update it with the request body
    Transaction.updateOne(
      {
        _id: req.params.transaction_id,
        user_ref_id: user_ref_id,
      },
      req.body,
      {
        new: true,
      }
    )
      .then((transaction) => {
        if (!transaction) {
          return res.status(404).send({
            message:
              "Transaction not found with id " + req.params.transaction_id,
          });
        }
        res.send(transaction);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message:
              "Transaction not found with id " + req.params.transaction_id,
          });
        }
        return res.status(500).send({
          message:
            "Error updating transaction with id " + req.params.transaction_id,
        });
      });
  } catch (error) {
    res.status(500).send({
      status: "fail",
      message:
        error.message || "Some error occurred while creating the transaction.",
    });
  }
};

// Delete a transaction with the specified transaction_id in the request
exports.delete = (req, res) => {
  const identifier = req.user.phone_number;
  let found = false;
  UserModel.findOne({ identifier })
    .then((user) => {
      let stores = user.stores;
      stores.forEach((store) => {
        let customers = store.customers;
        if (customers.length > 0) {
          customers.forEach((customer) => {
            let transactions = customer.transactions;
            transactions.forEach((transaction, index) => {
              if (transaction._id == req.params.transaction_id) {
                found = true;
                transactions.splice(index, 1);
              }
            });
          });
        }
      });
      if (found == false) {
        return res.status(404).json({
          status: false,
          message: "transaction not found",
          error: {
            code: 404,
            message: "transaction not found",
          },
        });
      }
      user
        .save()
        .then((result) => {
          res.status(200).json({
            success: true,
            message: "transaction deleted successful",
            data: {
              statusCode: 200,
            },
          });
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: "Error deleting transaction",
            data: {
              statusCode: 500,
              err,
            },
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: {
          code: 404,
          message: err,
        },
      });
    });
};
