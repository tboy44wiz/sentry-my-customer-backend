const Transaction = require("../models/transaction");
const CustomerModel = require("../models/customer");
const UserModel = require("../models/user");
const StoreModel = require("../models/store");

// Create and Save a new Transaction
exports.create = async(req, res, next) => {
  try {
    let {
      amount,
      interest,
      total_amount,
      description,
      phone_number,
      store_name,
      transaction_name,
      transaction_role,
    } = req.body;

    let req_keys = [
      amount,
      interest,
      total_amount,
      description,
      phone_number,
      store_name,
      transaction_name,
      transaction_role,
    ];

    //checks if any of the above fields is empty
    for (var k in req_keys) {
      if (!req_keys[k]) {
        throw "fail";
      }
    }

    // gets user_ref_id
    const email = req.user.email;
    var user_ref_id;
    await UserModel.findOne({ email })
      .then((user) => {
        user_ref_id = user._id;
      })
      .catch((err) => {
        res.status(404).send({
          success: false,
          message: "User not found",
          error: err,
        });
      });

    // gets customer_ref_id
    var customer_ref_id;
    await CustomerModel.findOne({ phone_number })
      .then((data) => {
        customer_ref_id = data._id;
      })
      .catch((err) => {
        res.status(404).send({
          success: false,
          message: "invalid phone number",
          error: err,
        });
      });
    // gets store_ref_id
    var store_ref_id;
    await StoreModel.findOne({ store_name })
      .then((data) => {
        store_ref_id = data._id;
      })
      .catch((err) => {
        res.status(404).send({
          success: false,
          message: "Store not found",
          error: err
        });
      });
    setTimeout(() => {
      const transaction = new Transaction({
        amount,
        interest,
        total_amount,
        description,
        user_ref_id,
        customer_ref_id,
        store_ref_id,
        transaction_name,
        transaction_role,
      })
        .save()
        .then((result) => {
          res.status(200).send({
            success: true,
            message: "Record created",
            data: {
              result
            }
          });
        })
        .catch((err) => {
          res.status(409).send({
            success: false,
            message: "Error creating transaction details with the same transaction name or role as previously saved data",
            error: err
          });
        });
    }, 1500);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Server error",
      error
    });
  }
};

// Retrieve and return all transactions from the database.
exports.findAll = async (req, res, next) => {
  try {
    var query = await UserModel.findOne(
      {
        email: req.user.email,
      },
      function (err, result) {
        if (err) {
          throw err;
        }
      }
    );
    //console.log(query);
    query = { user_ref_id: query._id };
    // gets store_ref_id
    StoreModel.find(
      {
        email: req.user.email,
      },
      function (err, result) {
        if (err) {
          throw err;
        }
      }
    );
    //console.log("Found.")

    Transaction.find(query)
      .then((transactions) => {
        res.status(200).send({
          success: true,
          message: 'Records loaded',
          data: {
            transactions
          }
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: err.message || "Some error occurred while retrieving transactions.",
          error: err
        });
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Some error occurred while retrieving transactions.",
      error: error
    });
  }
};

// Find a single transaction with a transaction_id
exports.findOne = async (req, res, next) => {
  try {
    // gets user_ref_id
    var user_ref_id = await UserModel.find(
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
      }
    );
    //console.log("Found.")

    Transaction.findOne({
      user_ref_id: user_ref_id,
      _id: req.params.transaction_id,
    })
      .then((transaction) => {
        if (!transaction) {
          return res.status(404).send({
            success: false,
            message: "Transaction not found with id " + req.params.transaction_id,
            error: {
              message: "Transaction not found with id " + req.params.transaction_id
            }
          });
        }
        res.status(200).send({
          success: true,
          message: 'Record loaded',
          data: {
            transaction
          }
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            success: false,
            message: "Transaction not found with id " + req.params.transaction_id,
            error:err
          });
        }
        return res.status(500).send({
          success: false,
          message: "Error retrieving transaction with id " + req.params.transaction_id,
          error:err
        });
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: err.message || "Some error occurred while retrieving transactions.",
      error: error
    });
  }
};

// Update a transaction identified by the transaction_id in the request
exports.update = async (req, res, next) => {
  try {
    // Validate Request
    if (!req.body) {
      return res.status(400).send({
        success: false,
        message: "Transaction content can not be empty",
        error: {
          message: "Transaction content can not be empty"
        }
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
            success: false,
            message: "Transaction not found with id " + req.params.transaction_id,
            error: {
              message: "Transaction not found with id " + req.params.transaction_id
            }
          });
        }
        res.send(transaction);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            success: false,
            message: "Transaction not found with id " + req.params.transaction_id,
            error: err
          });
        }
        return res.status(500).send({
          success: false,
          message: "Error updating transaction with id " + req.params.transaction_id,
          error: err
        });
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Some error occurred while creating the transaction.",
      error
    });
  }
};

// Delete a transaction with the specified transaction_id in the request
exports.delete = async (req, res, next) => {
  try {
    Transaction.findByIdAndRemove(req.params.transaction_id)
      .then((transaction) => {
        if (!transaction) {
          return res.status(404).send({
            success: false,
            message: "Transaction not found with id " + req.params.transaction_id,
            error: {
              message: "Transaction not found with id " + req.params.transaction_id
            }
          });
        }
        res.send({
          message: "Transaction deleted successfully!",
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            success: false,
            message: "Transaction not found with id " + req.params.transaction_id,
            error: err
          });
        }
        return res.status(500).send({
          success: false,
          message: "Could not delete transaction with id " + req.params.transaction_id,
          error: err
        });
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Some error occurred while creating the transaction.",
      error
    });
  }
};
