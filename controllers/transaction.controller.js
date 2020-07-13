const Transaction = require("../models/transaction");
const UserModel = require("../models/store_admin");
const StoreModel = require("../models/store");
const { body } = require('express-validator/check');

exports.validate = (method) => {
  switch (method) {
    case 'create': {
      return [
        body('store_id').isString(),
        body('customer_id').isString(),
        body('amount').isNumeric(),
        body('interest').isNumeric(),
        body('total_amount').isNumeric(),
        body('description').optional().isString(),
        body('type').isString(),
        body('status').optional().isString().isIn(["paid", "unpaid", "pending"]),
        body('transaction_name').optional().isString(),
        body('transaction_role').optional().isString()
      ]
    }
    case 'find': {
      return [
        body('store_id').isString(),
        body('customer_id').isString()
      ]
    }
    case 'update': {
      return [
        body('store_id').isString(),
        body('customer_id').isString(),
        body('amount').optional().isNumeric(),
        body('interest').optional().isNumeric(),
        body('total_amount').optional().isNumeric(),
        body('description').optional().isString(),
        body('type').optional().isString(),
        body('status').optional().isString().isIn(["paid", "unpaid", "pending"]),
        body('transaction_name').optional().isString(),
        body('transaction_role').optional().isString()
      ]
    }
  }
}

// Create and Save a new Transaction
exports.create = async (req, res, next) => {
  try{
    const identifier = req.user.phone_number;
    const user = await UserModel.findOne({ identifier });
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {
          statusCode: 404,
          message: "User not found",
        },
      });
    }

    const store = user.stores.find(store => store._id == req.body.store_id)
    if(!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
        data: {
          statusCode: 404,
          message: "Store not found",
        },
      });
    }

    const customer = store.customers.find(customer => customer._id == req.body.customer_id)
    if(!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        data: {
          statusCode: 404,
          message: "Customer not found",
        },
      });
    }

    customer.transactions.push({
      store_ref_id: req.body.store_id,
      customer_ref_id:req.body.customer_id,
      amount: req.body.amount,
      interest: req.body.interest,
      total_amount: req.body.customer_id,
      description: req.body.description || "Not set",
      type: req.body.type,
      status: req.body.status || "unpaid",
      transaction_name: req.body.transaction_name || null,
      transaction_role: req.body.transaction_role || null
    })

    await user.save()

    res.status(201).json({
      success: true,
      message: "Transaction saved",
      data: {
        user
      },
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: {
        statusCode: 500,
        message: error,
      },
    });
  }
};

// Retrieve and return all transactions from the database.
exports.findAll = async (req, res) => {
  try {
    const identifier = req.user.phone_number;
    const user = await UserModel.findOne({ identifier });
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {
          statusCode: 404,
          message: "User not found",
        },
      });
    }

    const store = user.stores.find(store => store._id == req.body.store_id)
    if(!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
        data: {
          statusCode: 404,
          message: "Store not found",
        },
      });
    }

    const customer = store.customers.find(customer => customer._id == req.body.customer_id)
    if(!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        data: {
          statusCode: 404,
          message: "Customer not found",
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Transactions",
      data: {
        transactions: customer.transactions,
      },
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: {
        statusCode: 500,
        message: error,
      },
    });
  }
};

// Find a single transaction with a transaction_id
exports.findOne = async (req, res) => {
  try {
    const identifier = req.user.phone_number;
    const user = await UserModel.findOne({ identifier });
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {
          statusCode: 404,
          message: "User not found",
        },
      });
    }

    const store = user.stores.find(store => store._id == req.body.store_id)
    if(!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
        data: {
          statusCode: 404,
          message: "Store not found",
        },
      });
    }

    const customer = store.customers.find(customer => customer._id == req.body.customer_id)
    if(!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        data: {
          statusCode: 404,
          message: "Customer not found",
        },
      });
    }

    const transaction = customer.transactions.find(transactions => transactions._id == req.params.transaction_id)
    if(!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
        data: {
          statusCode: 404,
          message: "Transaction not found",
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction",
      data: {
        transaction: transaction,
      },
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      message: "Something went wrongr",
      data: {
        statusCode: 500,
        message: error,
      },
    });
  }
};

// Update a transaction identified by the transaction_id in the request
exports.update = async (req, res) => {
  try {
    const identifier = req.user.phone_number;
    const user = await UserModel.findOne({ identifier });
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {
          statusCode: 404,
          message: "User not found",
        },
      });
    }

    const store = user.stores.find(store => store._id == req.body.store_id)
    if(!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
        data: {
          statusCode: 404,
          message: "Store not found",
        },
      });
    }

    const customer = store.customers.find(customer => customer._id == req.body.customer_id)
    if(!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        data: {
          statusCode: 404,
          message: "Customer not found",
        },
      });
    }

    const transaction = customer.transactions.find(transactions => transactions._id == req.params.transaction_id)
    if(!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
        data: {
          statusCode: 404,
          message: "Transaction not found",
        },
      });
    }

    transaction.amount = req.body.amount || transaction.amount
    transaction.interest = req.body.interest || transaction.interest
    transaction.total_amount = req.body.total_amount || transaction.total_amount
    transaction.description = req.body.description || transaction.description
    transaction.type = req.body.type  || transaction.type 
    transaction.status = req.body.status || transaction.status
    transaction.transaction_name = req.body.transaction_name || transaction.transaction_name
    transaction.transaction_role = req.body.transaction_role || transaction.transaction_role

    await user.save()
    res.status(200).json({
      success: true,
      message: "Transaction updated",
      data: {
        transaction: transaction,
      },
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: {
        statusCode: 500,
        message: error,
      },
    });
  }
};

// Delete a transaction with the specified transaction_id in the request
exports.delete = async (req, res) => {
  try {
    const identifier = req.user.phone_number;
    const user = await UserModel.findOne({ identifier });
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {
          statusCode: 404,
          message: "User not found",
        },
      });
    }

    const store = user.stores.find(store => store._id == req.body.store_id)
    if(!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
        data: {
          statusCode: 404,
          message: "Store not found",
        },
      });
    }

    const customer = store.customers.find(customer => customer._id == req.body.customer_id)
    if(!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        data: {
          statusCode: 404,
          message: "Customer not found",
        },
      });
    }

    const transactions = customer.transactions.filter(transactions => transactions._id != req.params.transaction_id)
    customer.transactions = transactions

    await user.save()
    res.status(200).json({
      success: true,
      message: "Transactions",
      data: {
        transactions
      },
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      message: "Something went wrongr",
      data: {
        statusCode: 500,
        message: error,
      },
    });
  }
};
