const Response = require("../util/response_manager");
const HttpStatus = require("../util/http_status");
const Transaction = require("../models/transaction");
const CustomerModel = require("../models/customer");
const UserModel = require("../models/store_admin");
const StoreModel = require("../models/store");

// Create and Save a new Transaction
exports.create = async (req, res, next) => {

  try {
    let {
      amount,
      interest,
      total_amount,
      description,
      phone_number,
      store_name,
      type
    } = req.body;

    let req_keys = [
      amount,
      interest,
      total_amount,
      description,
      phone_number,
      store_name,
      type
    ];

    let customer_ref_id = phone_number
    let store_ref_id = store_name
    let user_ref_id;

    //checks if any of the above fields is empty
    for (var k in req_keys) {
      if (!req_keys[k]) {
        throw "fail";
      }
    }

    // gets user_ref_id
    const phone = req.user.phone_number;
    await UserModel.findOne({ identifier: phone })
      .then((user) => {
        user_ref_id = user._id;
      })
      .catch((err) => {
        res.status(404).json({
          message: "User not found",
          error: err,
        });
      });

    // // gets customer_ref_id
    // await CustomerModel.findOne({ phone_number })
    //   .then((data) => {
    //     customer_ref_id = data._id;
    //   })
    //   .catch((err) => {
    //     res.status(404).json({
    //       message: "invalid phone number",
    //       error: err,
    //     });
    //   });


    // // gets store_ref_id
    // await StoreModel.findOne({ store_name })
    //   .then((data) => {
    //     store_ref_id = data._id;
    //   })
    //   .catch((err) => {
    //     res.status(404).json({
    //       message: "Store not found",
    //     });
    //   });
    

    setTimeout(() => {
    const transaction = new Transaction({
      amount,
      interest,
      total_amount,
      description,
      user_ref_id,
      customer_ref_id,
      store_ref_id,
      type
    })

    transaction.save().then((result) => {
      res.status(200).json({
        status: "success",
        result,
      });
    })
      .catch((err) => {
        res.status(409).json({
          error:
            "Error creating transaction details with the same transaction name or role as previously saved data",
        });
      });
    }, 1500);
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
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
        res.send(transactions);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving transactions.",
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
            "Error retrieving transaction with id " + req.params.transaction_id,
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

// Update a transaction identified by the transaction_id in the request
exports.update = async (req, res, next) => {
  const identifier = req.user.phone_number;
  const id = req.params.transaction_id;
  const { store_name, description, amount, interest, total_amount, type } = req.body;

  try {

    UserModel.findOne({ identifier })
      .then(user => {
        let store = user.stores.find(store => store.store_name == store_name); //find store
        let allTransactions = []; // all transactions would be pushed here

        store.customers.forEach(customer => { // loop over customers
          customer.transactions.forEach(trans => { //loop over transactions
            allTransactions.push(trans); //push all transactions to allTransactions
          })
        });

        let transToUpdate = allTransactions.find(trans => trans._id == id); // find transaction required

        let update = {
          amount: amount || transToUpdate.amount,
          description: description || transToUpdate.description,
          interest: interest || transToUpdate.interest,
          total_amount: total_amount || transToUpdate.total_amount,
          type: type || transToUpdate.type
        } // update with field from req.body or if null still use the value already in db

        transToUpdate = Object.assign(transToUpdate, update); // merge update

        user.save()
          .then(result => {
            res.status(200).json({
              success: true,
              message: "Transaction updated successfully",
              data: {
                  statusCode: 200,
                  transaction: transToUpdate
              }
            })
          })
          .catch((err) => {
            res.status(500).json({
              sucess: false,
              message: "Couldn't update transaction",
              error: {
                statusCode: 500,
                message: "Couldn't update transaction"
              }
            })
          })
        
      })
      .catch(err => {
        res.status(404).json({
          sucess: false,
          message: "User not found",
          error: {
            statusCode: 404,
            message: "User not found"
          }
        })
      })

  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "Couldn't update transaction",
      error: {
        statusCode: 500,
        message: "Couldn't update transaction"
      }
    })
  }
};

// Delete a transaction with the specified transaction_id in the request
exports.delete = async (req, res, next) => {
  try {
    Transaction.findByIdAndRemove(req.params.transaction_id)
      .then((transaction) => {
        if (!transaction) {
          return res.status(404).send({
            message:
              "Transaction not found with id " + req.params.transaction_id,
          });
        }
        res.send({
          message: "Transaction deleted successfully!",
        });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            message:
              "Transaction not found with id " + req.params.transaction_id,
          });
        }
        return res.status(500).send({
          message:
            "Could not delete transaction with id " + req.params.transaction_id,
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
