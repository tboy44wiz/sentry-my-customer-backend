const UserModel = require("../models/store_admin");
const { body } = require("express-validator/check");
const Debt = require("../models/debt_reminders");
const Response = require("../util/response_manager");
const HttpStatus = require("../util/http_status");
const mongoose = require("mongoose");
const Transaction = require("../models/transaction");
const { all } = require("../routes/customer");
const cron = require("node-cron");
const africastalking = require("africastalking")({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
});

exports.validate = (method) => {
  switch (method) {
    case "body": {
      return [
        body("store_name").isString(),
        body("customer_phone_number").isLength({ min: 3 }),
        body("message").isLength({ min: 3 }),
        body("status").isLength({ min: 3 }),
        body("pay_date").isLength({ min: 3 }),
        body("transaction_id").optional(),
        body("name").isString().isLength({ min: 1 }),
        body("amount").isLength({ min: 3 }),
      ];
    }
  }
};

exports.create = async (req, res) => {
  // Add new message
  let transaction_id = req.body.transaction_id || req.params.transaction_id;
  let identifier = req.user.phone_number;
  const {
    store_name,
    customer_phone_number,
    message,
    status,
    pay_date,
    amount,
    name,
  } = req.body;

  if (!transaction_id) {
    res.status(500).json({
      sucess: false,
      message: "Missing fields",
      error: {
        statusCode: 500,
        message: "transaction_id is required",
      },
    });
  }

  try {
    UserModel.findOne({ identifier })
      .then((user) => {
        let store = user.stores.find((store) => store.store_name == store_name);
        let customer = store.customers.find(
          (customer) => customer.phone_number === customer_phone_number
        );
        let transaction = customer.transactions.find(
          (transaction) => transaction._id == transaction_id
        );

        const newDebt = {
          user_phone_number: identifier,
          customer_phone_number,
          amount: amount,
          ts_ref_id: transaction._id,
          message: message,
          status: status,
          expected_pay_date: new Date(pay_date),
          name: name,
        };

        transaction.debts.push(newDebt);

        user.save().then((result) => {
          res.status(200).json({
            success: true,
            message: "Debt created successfully",
            data: {
              statusCode: 200,
              debt: transaction.debts[transaction.debts.length - 1],
            },
          });
        });
      })
      .catch((err) => {
        res.status(404).json({
          sucess: false,
          message: "User not found or some body parameters are not correct",
          error: {
            statusCode: 404,
            message: err.message,
          },
        });
      });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: "Some error occurred while creating debt",
      error: {
        statusCode: 500,
        message: err.message,
      },
    });
  }
};

// Find all the Debts
exports.getAll = async (req, res) => {
  const identifier = req.user.phone_number;

  UserModel.findOne({ identifier })
    .then((user) => {
      let allDebts = [];
      user.stores.forEach((store) => {
        store.customers.forEach((customer) => {
          customer.transactions.forEach((transaction) => {
            transaction.debts.forEach((debt) => {
              let debtToSend = { debt_obj: debt, store_name: store.store_name };
              allDebts.push(debtToSend);
            });
          });
        });
      });

      return res.status(200).json({
        success: true,
        message: "All Debts",
        data: {
          statusCode: 200,
          debts: allDebts,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        sucess: false,
        message: "Couldn't find user or some server error occurred",
        error: {
          statusCode: 500,
          message: err.message,
        },
      });
    });
};

exports.getById = async (req, res) => {
  let identifier = req.user.phone_number;
  if (!req.params.debtId)
    return res.json({
      success: false,
      message: "No Id sent",
      error: {
        statusCode: 400,
        message: "No Id sent",
      },
    });

  UserModel.findOne({ identifier })
    .then((user) => {
      let allDebts = [];
      user.stores.forEach((store) => {
        store.customers.forEach((customer) => {
          customer.transactions.forEach((transaction) => {
            transaction.debts.forEach((debt) => {
              allDebts.push(debt);
            });
          });
        });
      });

      let debtById = allDebts.find((debt) => debt._id == req.params.debtId);

      return res.status(200).json({
        success: true,
        message: "Debt found",
        data: {
          statusCode: 200,
          debt: debtById,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        sucess: false,
        message: "Couldn't find user or some server error occurred",
        error: {
          statusCode: 500,
          message: err.message,
        },
      });
    });
};

exports.updateById = async (req, res) => {
  let identifier = req.user.phone_number;
  let { status, message, amount, pay_date, name } = req.body;

  try {
    UserModel.findOne({ identifier })
      .then((user) => {
        let allDebts = [];
        user.stores.forEach((store) => {
          store.customers.forEach((customer) => {
            customer.transactions.forEach((transaction) => {
              transaction.debts.forEach((debt) => {
                allDebts.push(debt);
              });
            });
          });
        });

        let debtById = allDebts.find((debt) => debt._id == req.params.debtId);
        let update = {
          name: name || debtById.name,
          amount: amount || debtById.amount,
          message: message || debtById.message,
          status: status || debtById.status,
          pay_date: Date(pay_date) || debtById.expected_pay_date,
        };
        debtById = Object.assign(debtById, update);
        user.save().then((result) => {
          res.status(200).json({
            success: true,
            message: "Debt updated successfully",
            data: {
              statusCode: 200,
              debt: debtById,
            },
          });
        });
      })
      .catch((err) => {
        res.status(404).json({
          sucess: false,
          message: "Couldn't find user or some server error occurred",
          error: {
            statusCode: 404,
            message: err.message,
          },
        });
      });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: "Some server error occurred",
      error: {
        statusCode: 500,
        message: err.message,
      },
    });
  }
};

exports.deleteById = async (req, res) => {
  let identifier = req.user.phone_number;
  let id = req.params.debtId;
  UserModel.findOne({ identifier })
    .then((user) => {
      let stores = user.stores;
      stores.forEach((store) => {
        let customers = store.customers;
        if (customers.length > 0) {
          customers.forEach((customer) => {
            let transactions = customer.transactions;
            transactions.forEach((transaction, index) => {
              let debts = transaction.debts;
              debts.forEach((debt, index) => {
                if (debt._id == id) {
                  debts.splice(index, 1);
                }
              });
            });
          });
        }
      });

      user
        .save()
        .then((result) => {
          res.status(201).json({
            success: true,
            message: "Debt deleted successfully",
            data: {
              statusCode: 201,
              Message: "Debt deleted successfully",
            },
          });
        })
        .catch((err) => {
          res.status(404).json({
            sucess: false,
            message: "Couldn't remove debt",
            error: {
              statusCode: 404,
              message: err.message,
            },
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        sucess: false,
        message: "Couldn't find user or some server error occurred",
        error: {
          statusCode: 404,
          message: err.message,
        },
      });
    });
};

let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

// Send reminder route
exports.send = (req, res) => {
  const { debt_id, message } = req.body;

  if (!debt_id) {
    return res.send(400).json({
      success: false,
      Message: "Please enter a valid debt_id",
      error: {
        errorCode: "400",
        Message: "Please enter a valid debt_id",
      },
    });
  }
  let identifier = req.user.phone_number;
  let to, store_name, amount, expected_date, reminder_message;

  UserModel.findOne({ identifier })
    .then((user) => {
      user.stores.forEach((store) => {
        store.customers.forEach((customer) => {
          customer.transactions.forEach((transaction) => {
            transaction.debts.forEach((debt) => {
              if (debt._id == debt_id) {
                to = debt.customer_phone_number;
                amount = debt.amount;
                store_name = store.store_name;
                expected_date = debt.expected_pay_date;
              }
            });
          });
        });
      });

      if (message == undefined) {
        reminder_message = `You have an unpaid debt of ${amount} in ${store_name} and would be due on the ${expected_date.getDay()}/${expected_date.getMonth()}/${expected_date.getFullYear()}`;
      } else {
        reminder_message = message;
      }

      if (regex.test(to)) {
        const sms = africastalking.SMS;
        sms
          .send({
            to,
            message: reminder_message,
            enque: true,
          })
          .then((response) => {
            console.log(response);
            res.status(200).json({
              success: true,
              Message: "Reminder send",
              details: {
                to,
                reminder_message,
              },
              response,
            });
          })
          .catch((err) => {
            console.log(err);
            res.send(err);
          });
      } else {
        res.send("invalid customer phone number");
      }
    })
    .catch((err) => {
      res.status(500).json({
        sucess: false,
        message: "Something Went wrong",
        error: {
          statusCode: 500,
          message: err.message,
        },
      });
    });
};

// Schedule reminder route
exports.schedule = (req, res) => {
  const { message, scheduleDate, time } = req.body;

  if (!scheduleDate || !time) {
    return res.send(400).json({
      success: false,
      Message: "Please enter a valid scheduleDate and time",
      error: {
        errorCode: "400",
        Message: "Please enter a valid scheduleDate and time",
      },
    });
  }
  let identifier = req.user.phone_number;
  let store_name, amount, expected_date, reminder_message;
  let to = [];
  let messages = [];

  UserModel.findOne({ identifier })
    .then((user) => {
      user.stores.forEach((store) => {
        store.customers.forEach((customer) => {
          customer.transactions.forEach((transaction) => {
            transaction.debts.forEach((debt) => {
              to.push(debt.customer_phone_number);
              amount = debt.amount;
              store_name = store.store_name;
              expected_date = debt.expected_pay_date;
              reminder_message = `You have an unpaid debt of ${amount} in ${store_name} and would be due on the ${expected_date.getDay()}/${expected_date.getMonth()}/${expected_date.getFullYear()}`;
              messages.push(reminder_message);
            });
          });
        });
      });

      let receipient = [];

      to.forEach((number, index) => {
        if (regex.test(number)) {
          receipient.push(number);
        }
      });

      let m = time.slice(0, 2);
      let h = time.slice(3);
      let d = scheduleDate.slice(0, 2);
      let mo = scheduleDate.slice(3, 5);

      const send = cron.schedule(`${m} ${h} ${d} ${mo} *`, () => {
        const sms = africastalking.SMS;
        receipient.forEach((receipient, index) => {
          sms
            .send({
              to: receipient,
              message: messages[index],
            })
            .then((response) => {
              console.log(response);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        console.log(messages);
      });
      res.status(200).json({
        success: true,
        Message: "Reminder Scheduled",
        details: {
          receipient,
          messages,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        sucess: false,
        message: "Something went wrong",
        error: {
          statusCode: 500,
          message: err.message,
        },
      });
    });
};
